import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Document_or_Message } from 'src/app/Models/Document_or_Message';
import { Message } from 'src/app/Models/MessageModel';
import { UserServiceService } from 'src/app/Service/user-service.service';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.scss']
})
export class EditionComponent {
  messageForm! : FormGroup
  message!: Document_or_Message
  message1!: Message;

  constructor( private dialogRef: MatDialogRef<EditionComponent>,private userService: UserServiceService, private router: Router) {}


  ngOnInit(): void{
     
    
    this.message = this.userService.GetMessageEdition();

    this.messageForm = new FormGroup({
      message: new FormControl(this.message.content_or_FileName, [Validators.required]),
    });

  }

 
  submit(): void{

    if (this.messageForm.valid) {
      
      const messageData:  Message ={
        
        id: this.message.id,
        content:  this.messageForm.value.message,
        sentAt: new Date().toISOString(),
        idConversation: this.message.idConversation,
        status: this.message.status,
        seen: false,
        userId: this.message.userId
      } 
      
      this.userService.UpdateMessage(messageData).subscribe(
                    
        (response) => {
     
             if(response.data){
              const messDoc: Document_or_Message= {
          
                id: response.data.id,
                content_or_FileName: response.data.content,
                sentAt_or_UploadedAt: response.data.sentAt,
                idConversation:  response.data.idConversation,
                status:  response.data.status,
                userId:  response.data.userId,
                doawloaded: response.data.seen,
                type: 'message'
                
              };
              
          this.userService.SetMessageEdition(messDoc);
          this.dialogRef.close('true');
             }

         
        },
        (error) => {

          console.error('Erro ao Actualizar Menssagem:', error);

        }
      );
    }
  }

  Close(): void{
     this.dialogRef.close('true');
  }

}
