import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type Language = 'pt' | 'en' | 'es';

@Injectable()
export class TranslateProfessionalPipe implements NestInterceptor {
  private availabilityMap = {
    pt: {
      FULL_TIME: 'Tempo Integral',
      PART_TIME: 'Meio Período',
      DAILY: 'Diária',
      WEEKENDS: 'Fins de Semana',
      ANY: 'Qualquer disponibilidade',
    },
    en: {
      FULL_TIME: 'Full Time',
      PART_TIME: 'Part Time',
      DAILY: 'Daily',
      WEEKENDS: 'Weekends',
      ANY: 'Any Availability',
    },
    es: {
      FULL_TIME: 'Tiempo Completo',
      PART_TIME: 'Medio Tiempo',
      DAILY: 'Diaria',
      WEEKENDS: 'Fines de Semana',
      ANY: 'Cualquier disponibilidad',
    },
  };

  private experienceMap = {
    pt: {
      LESS_THAN_1: 'Menos de 1 ano',
      ONE_TO_THREE: '1-3 anos',
      THREE_TO_FIVE: '3-5 anos',
      MORE_THAN_FIVE: 'Mais de 5 anos',
    },
    en: {
      LESS_THAN_1: 'Less than 1 year',
      ONE_TO_THREE: '1-3 years',
      THREE_TO_FIVE: '3-5 years',
      MORE_THAN_FIVE: 'More than 5 years',
    },
    es: {
      LESS_THAN_1: 'Menos de 1 año',
      ONE_TO_THREE: '1-3 años',
      THREE_TO_FIVE: '3-5 años',
      MORE_THAN_FIVE: 'Más de 5 años',
    },
  };

  private weekdayMap = {
    pt: {
      MONDAY: 'Segunda-feira',
      TUESDAY: 'Terça-feira',
      WEDNESDAY: 'Quarta-feira',
      THURSDAY: 'Quinta-feira',
      FRIDAY: 'Sexta-feira',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo',
    },
    en: {
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday',
    },
    es: {
      MONDAY: 'Lunes',
      TUESDAY: 'Martes',
      WEDNESDAY: 'Miércoles',
      THURSDAY: 'Jueves',
      FRIDAY: 'Viernes',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo',
    },
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const lang = this.resolveLanguage(request.headers['accept-language']);

    return next.handle().pipe(
      map((data) => {
        const translate = (professional) => ({
          ...professional,
          availabilityTypeTranslated:
            this.availabilityMap[lang][professional.availabilityType],
          experienceLevelTranslated:
            this.experienceMap[lang][professional.experienceLevel],
          availability: (professional.availability || []).map((item) => ({
            ...item,
            weekdayTranslated: this.weekdayMap[lang][item.weekday],
          })),
        });

        return Array.isArray(data)
          ? data.map(translate)
          : translate(data);
      }),
    );
  }

  private resolveLanguage(headerLang: string): Language {
    if (!headerLang) return 'pt';
    const lang = headerLang.toLowerCase().split(',')[0];
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('es')) return 'es';
    return 'pt'; // default
  }
}
