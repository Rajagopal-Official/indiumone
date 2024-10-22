import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './hello.component.html',
  styleUrls:['./hello.component.css']
})
export class HelloComponent {

}
