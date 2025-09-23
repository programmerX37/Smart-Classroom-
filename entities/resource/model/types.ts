export interface Resource {
  id: string;
  name: string;
  type: 'Room' | 'Equipment';
  capacity?: number;
}