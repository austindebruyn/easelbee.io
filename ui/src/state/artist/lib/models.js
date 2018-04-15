import { schema } from 'normalizr';

export const optionAttachment = new schema.Entity('optionAttachments');
export const options = new schema.Entity('options', { optionAttachment });
export const questions = new schema.Entity('questions', { options: [options] });
export const forms = new schema.Entity('forms', { questions: [questions] });
