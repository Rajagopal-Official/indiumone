export interface Home {
    image: string;
    title: string;
    description: string;
    link: string;
    department: string | string[];
    bandComparison?:string,
    bandLevel?:string
  }