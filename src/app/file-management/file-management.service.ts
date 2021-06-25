import {Injectable, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Subject, throwError} from 'rxjs';
import {FileModel} from './file.model';
import {catchError} from 'rxjs/operators';

const BACKEND_URL = environment.backend_URL;

@Injectable
(
    {
        providedIn : 'root'
    }
)
export class FileManagementService implements OnInit
{
    private files = [];

    private filesUpdated = new Subject<{filesData: FileModel[]}>();

    ngOnInit()
    {
        this.filesUpdated.subscribe
        (
            (filesData) =>
            {
                this.files = filesData.filesData;
            }
        )
    }

    get filesSubject()
    {
        return this.filesUpdated;
    }

    constructor(private authService: AuthService, private http: HttpClient)
    {
    }

    getFilesDetails()
    {
        // return this.http
        //     .get
        //     (
        //         BACKEND_URL + '/files/getFilesDetails',
        //     );

        this.http.get
        (
            BACKEND_URL + '/files/getFilesDetails'
        )
            .pipe
            (
                catchError
                (
                    (error: any) =>
                    {
                        console.log(error);
                        return throwError('Error occurred');
                    }
                )
            )
            .subscribe
            (
                // tslint:disable-next-line:no-shadowed-variable
                (response: {message: string, data: FileModel[]}) =>
                {
                    this.filesUpdated
                        .next
                        (
                            {filesData: [...response.data]}
                        )
                }

            );
    }
    
    getFile(fileName: string)
    {
        return this.http
            .get
            (
                BACKEND_URL + '/files/getFile/' + fileName
            )
    }

    deleteFile(fileName: string)
    {
        return this.http
            .delete
            (
                BACKEND_URL + '/files/deleteFile/' + fileName
            )
    }
}
