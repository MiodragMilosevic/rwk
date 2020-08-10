import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private http: HttpClient) {
  }

  getAllVideos(): Observable<any> {
    return this.http.get(environment.baseUrl + `/medias`);
  }

  getStaticVideos() {
    return [{
      id: 7,
      name: 'Leonidas Kavakos',
      author: 'F. Mendelssohn Violin Concerto 2nd movement',
      content: 'Vienna Symphony Orchestra at the Konzerthaus Vienna',
      price: 2,
      duration: '1:59',
      place: 'London, UK',
      file_not_found: false,
      jwplayer_original: {media_id: 'dpf5097E', photo: 'https://cdn.jwplayer.com/thumbs/dpf5097E-720.jpg'},
      jwplayer_preview: {
        media_id: 'dpf5097E',
        video: 'https://cdn.jwplayer.com/videos/dpf5097E-OsM7U7r4.mp4?exp=1561309920\u0026sig=ec9f7a0e1b850ab8acb5bc9f54f5b8eb',
        photo: 'https://cdn.jwplayer.com/thumbs/dpf5097E-720.jpg'
      }
    }, {
      id: 3,
      name: 'Prof. Igor Petrushevski',
      author: 'COMING SOON',
      content: 'Masterclasses with one of the most successful violin teachers in the world',
      price: 20,
      duration: '0:00',
      place: null,
      file_not_found: false,
      jwplayer_original: {media_id: 'E1GbqnfY', photo: 'https://cdn.jwplayer.com/thumbs/E1GbqnfY-720.jpg'},
      jwplayer_preview: {
        media_id: 'E1GbqnfY',
        video: 'https://cdn.jwplayer.com/videos/E1GbqnfY-6iQuMSIZ.mp4?exp=1561309920\u0026sig=60e6e214c1d9d5b645ba5470f88b0e94',
        photo: 'https://cdn.jwplayer.com/thumbs/E1GbqnfY-720.jpg'
      }
    }, {
      id: 1,
      name: 'Symphony Orchestra 1',
      author: 'COMING SOON',
      content: 'Program to be announced',
      price: 20,
      duration: '0:00',
      place: null,
      file_not_found: false,
      jwplayer_original: {media_id: 'o8yfmXVV', photo: 'https://cdn.jwplayer.com/thumbs/o8yfmXVV-720.jpg'},
      jwplayer_preview: {
        media_id: 'o8yfmXVV',
        video: 'https://cdn.jwplayer.com/videos/o8yfmXVV-6iQuMSIZ.mp4?exp=1561309920\u0026sig=346d6a282e6fb4f7fce956050e79f117',
        photo: 'https://cdn.jwplayer.com/thumbs/o8yfmXVV-720.jpg'
      }
    }, {
      id: 4,
      name: 'Daniel Sarge',
      author: 'COMING SOON',
      content: 'Masterclasses with coach of Anna Netrebko',
      price: 20,
      duration: '0:00',
      place: null,
      file_not_found: false,
      jwplayer_original: {media_id: '8f8gRFNA', photo: 'https://cdn.jwplayer.com/thumbs/8f8gRFNA-720.jpg'},
      jwplayer_preview: {
        media_id: '8f8gRFNA',
        video: 'https://cdn.jwplayer.com/videos/8f8gRFNA-6iQuMSIZ.mp4?exp=1561309920\u0026sig=1b93357f29d0d794868b07d9c07dc8e6',
        photo: 'https://cdn.jwplayer.com/thumbs/8f8gRFNA-720.jpg'
      }
    }, {
      id: 2,
      name: 'Symphony Orchestra 2',
      author: 'COMING SOON',
      content: 'Program to be announced',
      price: 20,
      duration: '0:00',
      place: null,
      file_not_found: false,
      jwplayer_original: {media_id: 'Sm7lciZV', photo: 'https://cdn.jwplayer.com/thumbs/Sm7lciZV-720.jpg'},
      jwplayer_preview: {
        media_id: 'Sm7lciZV',
        video: 'https://cdn.jwplayer.com/videos/Sm7lciZV-6iQuMSIZ.mp4?exp=1561309920\u0026sig=b95320c26cde605558c3a95826fa8fca',
        photo: 'https://cdn.jwplayer.com/thumbs/Sm7lciZV-720.jpg'
      }
    }, {
      id: 5,
      name: 'Evelyn Schoerkhuber',
      author: 'COMING SOON',
      content: 'Masterclasses with one of the premier singing professors in Vienna',
      price: 20,
      duration: '0:00',
      place: null,
      file_not_found: false,
      jwplayer_original: {media_id: 'Py53w464', photo: 'https://cdn.jwplayer.com/thumbs/Py53w464-720.jpg'},
      jwplayer_preview: {
        media_id: 'Py53w464',
        video: 'https://cdn.jwplayer.com/videos/Py53w464-6iQuMSIZ.mp4?exp=1561309920\u0026sig=b6b18c946ff53453a4469f8419faf9ba',
        photo: 'https://cdn.jwplayer.com/thumbs/Py53w464-720.jpg'
      }
    }, {
      id: 6,
      name: 'Masterclasses',
      author: 'COMING SOON',
      content: 'Masterclasses to be announced',
      price: 20,
      duration: '0:00',
      place: null,
      file_not_found: false,
      jwplayer_original: {media_id: '1xP7TmJE', photo: 'https://cdn.jwplayer.com/thumbs/1xP7TmJE-720.jpg'},
      jwplayer_preview: {
        media_id: '1xP7TmJE',
        video: 'https://cdn.jwplayer.com/videos/1xP7TmJE-6iQuMSIZ.mp4?exp=1561309920\u0026sig=38c1bc5fcc564040924aca77facf7621',
        photo: 'https://cdn.jwplayer.com/thumbs/1xP7TmJE-720.jpg'
      }
    }];
  }

  getVideo(id: any): Observable<any> {
    return this.http.get(environment.baseUrl + `/medias/${id}`);
  }

  createVideoLicence(id: any): Observable<any> {
    const data = {
      media_id: id
    };
    return this.http.post(environment.baseUrl + `/media_licences`, data);
  }
}
