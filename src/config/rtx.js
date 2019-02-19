import rtxDefault from './rtx_default';
import rtxParty from './rtx_party';
import * as db from './db';
export default (db.sys_id === 0 ? rtxDefault : rtxParty);
