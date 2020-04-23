
/**
 * this contains the database connection specification
 * @author gaurav sharma
 * @since Wednesday, October 17, 2018 4:24 PM
 * @updated 19th April 2019
 */
import mongoose from 'mongoose';
import { Promise as es6Promise } from 'es6-promise';
import { mongoConnectionString } from '../constants';

const useNewUrlParser = true;

mongoose.Promise = es6Promise;
mongoose.connect(mongoConnectionString, { useNewUrlParser }, (err) => {
	if (err) {
		console.log('mongo connection err', err);
	} else {
		console.log('database connected');
	}
});

export default mongoose;
