export interface Link {
  text: string;
  url: string;
}

export interface Chapter {
  id: string;
  title: string;
  links: Link[];
}