import {DeepLService} from "./deepL.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  constructor(private deepLService: DeepLService) {}

  // Method for translating the given input to the given language
  async getData(input: string, lang: string): Promise<string> {
    // Translating the input using the DeepLService and waiting for the response
    const response = await this.deepLService.translate(input, lang).toPromise();
    // Returning the translated text from the response
    return response.translations[0].text;
  }
}
