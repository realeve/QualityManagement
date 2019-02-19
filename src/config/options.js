import * as db from './db';
import optionDefault from './options_default';
import optionParty from './options_party';
export default (db.sys_id === 0 ? optionDefault : optionParty);
