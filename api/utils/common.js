import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';


export const uuidValidateV4 = (uuid) => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

// Validate payload 
export const validatePayload = (data, fields) => {
    if (fields.length === 0) {
        return {message: "No fields to check.", status: false}
    }

    for (let i = 0; i < fields.length; i++) {
        if (!data[fields[i]]) {
            return {message: `${fields[i]} is missing`, status: false}
        }
    }
    return {message: "all required fields are in payload", status: true}
}

// Validate if given id is a uuid
export const validateId = (param, id) => {
    if (!uuidValidateV4(id)) {
        throw ({ code: 400, message: `Invalid path param ${param} id: ${id}` });
    }
}