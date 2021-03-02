import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public async showAlert(title: string, message: string): Promise<void> {
      await Swal.fire({
        title: title,
        text: message,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
  }

  public async showErr(title: string, message: string): Promise<void> {
      await Swal.fire({
        title: title,
        text: message,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK'
      });
  }

  public async showConfirm(title: string, message: string): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: message,
      type: 'question',
      showCancelButton: true,
      cancelButtonText: 'Não',
      confirmButtonText: 'Sim'
    });
    return await result.value;
  }
}
