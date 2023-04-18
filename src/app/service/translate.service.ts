import {DeepLService} from "./deepL.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  constructor(private deepLService: DeepLService) {

  }

  async getData(input: string, lang: string): Promise<string> {
    const response = await this.deepLService.translate(input, lang).toPromise();
    return response.translations[0].text;
  }
}
