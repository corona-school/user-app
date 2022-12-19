import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { LFUserType } from '../types/lernfair/User';
import useApollo from './useApollo';

type LFRegistration = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    userType: LFUserType;
    aboutMe?: string;
    // setRegistrationData: (data: Partial<LFRegistration>) => any
    setFirstname: (firstname: string) => any;
    setLastname: (lastname: string) => any;
    setEmail: (email: string) => any;
    setPassword: (password: string) => any;
    setUserType: (userType: LFUserType) => any;
    setAboutMe: (aboutMe: string) => any;
};

const LFRegistrationContext = createContext<LFRegistration>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    // setRegistrationData: () => null,
    userType: '',
    setFirstname: () => null,
    setLastname: () => null,
    setEmail: () => null,
    setPassword: () => null,
    setUserType: () => null,
    setAboutMe: () => null,
});

export const useRegistration = () => useContext(LFRegistrationContext);

export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const reg = useRegistrationProvider();

    return <LFRegistrationContext.Provider value={reg}>{children}</LFRegistrationContext.Provider>;
};

const useRegistrationProvider = () => {
    const [firstname, _setFirstname] = useState<string>('');
    const [lastname, _setLastname] = useState<string>('');
    const [email, _setEmail] = useState<string>('');
    const [password, _setPassword] = useState<string>('');
    const [userType, _setUserType] = useState<string>('');
    const [aboutMe, _setAboutMe] = useState<string>('');

    const setFirstname = (firstname: string) => _setFirstname(firstname);
    const setLastname = (lastname: string) => _setLastname(lastname);
    const setEmail = (email: string) => _setEmail(email);
    const setPassword = (password: string) => _setPassword(password);
    const setUserType = (userType: LFUserType) => _setUserType(userType);
    const setAboutMe = (aboutMe: string) => _setAboutMe(aboutMe);

    // const setRegistrationData = (data: Partial<LFRegistration>) => {
    //   data.firstname && _setFirstname(data.firstname)
    //   data.lastname && _setLastname(data.lastname)
    //   data.email && _setEmail(data.email)
    //   data.password && _setPassword(data.password)
    //   data.userType && _setUserType(data.userType)
    //   data.aboutMe && _setAboutMe(data.aboutMe)
    // }
    const d: LFRegistration = {
        firstname,
        lastname,
        email,
        password,
        userType,
        aboutMe,
        setFirstname,
        setLastname,
        setEmail,
        setPassword,
        setUserType,
        setAboutMe,
    };
    return d;
};

export default useRegistration;
