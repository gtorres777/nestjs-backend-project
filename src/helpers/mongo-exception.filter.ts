import { ArgumentsHost, Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongoose/node_modules/mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {

      const response = host.switchToHttp().getResponse();
      if (exception.code === 11000) {
        response.status(400).json({ 
            status: 401,
            message: 'Email already exists.'
         });
      } else {
        response.status(500).json({ message: 'Internal error.' });
      }
  }
}