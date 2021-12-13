import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from "rxjs";
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
public name: string =''
public questionList: any = []
public currentQuestion:number=0
public  points: number=0;
counter=60
correctAns:number = 0;
incorrectAns:number = 0;
progress:string = "0"
isQuizCompleted:boolean =false;
interval$:any
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!
    this.getAllQuestions();
    this.startCounter();
    
  }
  getAllQuestions(){
    this.questionService.getQuestionJson().subscribe(res=>{
     
      this.questionList = res.questions
      console.log('res',res);
      console.log('resq',res.questions);
      
    })
  }
  nextQuestion(){
    this.currentQuestion++
 
  }
  previousQuestion(){
    this.currentQuestion--
   
  }
  answer(currentQnum:number, option:any){
    
    if(currentQnum === this.questionList.length){
      this.isQuizCompleted=true;
      this.stopCounter();
    }
    if(option.correct){
      this.points+=10
      this.correctAns++;
      setTimeout(()=>{
        this.currentQuestion++
        this.resetCounter()
        this.getProgressPercentage()
      },1500)
   
    }else{

      setTimeout(()=>{
        this.currentQuestion++
        this.incorrectAns++
        this.resetCounter()
        this.getProgressPercentage()
      },1500)
     
      this.points-=10
    }
  }

  startCounter(){
    this.interval$ = interval(1000).subscribe(val=>{
      this.counter--;
      if(this.counter === 0 ){
        this.currentQuestion++;
        this.counter=60;
        this.points-=10;
      }
    })
    setTimeout(()=>{
      this.interval$.unsubscribe()
    },600000)
  }
  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0
  }
  resetCounter(){
    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.currentQuestion=0;
    this.progress="0"

  }
  getProgressPercentage(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString()
    console.log('progress',this.progress);
    
  }
}
