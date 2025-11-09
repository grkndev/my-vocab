
export type Word = {
    id: number;
    uniqueKey: string;
    name: string;
    meaning: string;
    forms?: string;
    example?: string;
  };
  
  export type SwipeResponse = Word & {
    status: boolean; // true = sağ (öğrendi), false = sol (tekrar)
  };
  