import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeepLService {

  private apiUrl = 'https://api-free.deepl.com/v2/translate';
  private apiKey = environment.deepLApiKey;

  constructor(private http: HttpClient) { }

  translate(text: string, targetLang: string): Observable<any> {
    const params = new HttpParams()
      .set('auth_key', this.apiKey)
      .set('text', text)
      .set('target_lang', targetLang);

    return this.http.post(this.apiUrl, params);
  }

}
