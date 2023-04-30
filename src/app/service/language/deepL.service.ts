import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeepLService {

  // Define the base URL for the DeepL API and the API key, taken from the environment configuration
  private apiUrl = 'https://api-free.deepl.com/v2/translate';
  private apiKey = environment.deepLApiKey;

  constructor(private http: HttpClient) {
  }

  // Define the method for translating text, which takes the text to be translated and the target language as parameters
  translate(text: string, targetLang: string): Observable<any> {
    // Define the parameters to be passed to the API, including the API key and the text and target language to be translated
    const params = new HttpParams()
      .set('auth_key', this.apiKey)
      .set('text', text)
      .set('target_lang', targetLang);

    // Make a POST request to the API using the HttpClient and the defined parameters, and return the response as an Observable
    return this.http.post(this.apiUrl, params);
  }

}
