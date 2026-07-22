import { BcryptUtils } from "./common/utils/bcrypt.utils";


async function main(){
    // login password
    const password = "12345";

    const hashpassword = await BcryptUtils.hashPassword(password);

    console.log(hashpassword);
}
main()