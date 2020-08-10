import { NgbDateParserFormatter, NgbDateStruct, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';

export class MomentDateFormatter extends NgbDateParserFormatter {

    readonly DT_FORMAT = 'YYYY-MM-DD';

    parse(value: string): NgbDateStruct {
        if (value) {
            value = value.trim();
            let momentDate = moment(value, this.DT_FORMAT);
            return { year: momentDate.year(), month: momentDate.month() + 1, day: momentDate.date() };
        }else
            return null;
    }
    
    format(date: NgbDateStruct) : string {
        const months: any = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        if (!date) return '';
        let value = '';
        value += months[date.month] + " " +  date.day +  ", " + date.year;
        return value;
    }
}