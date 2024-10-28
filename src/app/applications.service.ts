import { Injectable, signal } from '@angular/core';
import { Home } from './home/home.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  constructor() { }

  applications = signal<Home[]>([
    {
      image: '../../assets/Tuzo.png',
      title: 'Tuzo',
      description: 'See how Katie Sowers, Asst. Coach for the 49ers, uses Surface Pro 7 to put her plans into play.',
      link: 'https://indiumsoftware.tuzo.in/',
      department: 'HR'
    },
    {
      image: '../../assets/IndiumLogo.png',
      title: 'Cloud Cost Optimizer',
      description: 'Express yourself powerfully with a thin, light, and elegant design, faster performance.',
      link: '',
      department: 'Cloud Engineering'
    },
    {
      image: '../../assets/ixieLogo.jpg',
      title: 'iXie Gaming Application',
      description: 'Buy an Xbox One X console and double your fun with a free select extra controller.',
      link: '',
      department: 'Gaming'
    },
    {
      image: 'https://i.ibb.co/G57P0Pb/card4.png',
      title: 'Indium Web',
      description: 'Expect more. World class performance, with more privacy, more productivity.',
      link: '',
      department: 'Application Engineering'
    },
    {
      image: 'https://i.ibb.co/G57P0Pb/card4.png',
      title: 'Indium Mobile Application',
      description: 'Online meetings, chat and shared cloud storage - all in one place.',
      link: '',
      department: 'Mobile App Development'
    },
    {
      image: 'https://i.ibb.co/G57P0Pb/card4.png',
      title: 'Indium Mobile Application',
      description: 'Online meetings, chat and shared cloud storage - all in one place.',
      link: '',
      department: 'Mobile App Development'
    },
    {
      image: 'https://i.ibb.co/G57P0Pb/card4.png',
      title: 'Indium Mobile Application',
      description: 'Online meetings, chat and shared cloud storage - all in one place.',
      link: '',
      department: 'Mobile App Development'
    },
    {
      image: 'https://i.ibb.co/G57P0Pb/card4.png',
      title: 'Indium Mobile Application',
      description: 'Online meetings, chat and shared cloud storage - all in one place.',
      link: '',
      department: 'Mobile App Development'
    },
  ]);

  addApplication(application: Home) {
    this.applications.update(apps => [...apps, application]);
  }
}
