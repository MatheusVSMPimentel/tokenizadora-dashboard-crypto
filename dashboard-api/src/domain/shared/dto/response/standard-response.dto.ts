export class StandardResponseDto<T> {
    success: boolean;
    message: string;
    data: T[];  // Sempre uma lista de T
    count: number;
  
    constructor(success: boolean, message: string, data: T[]) {
      this.success = success;
      this.message = message;
      this.data = data;
      this.count = data.length;
    }
}