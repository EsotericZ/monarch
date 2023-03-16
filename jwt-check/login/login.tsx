import React ,{useState} from "react";

import {
    Box, HStack, Image, Button, Text, Heading, FormControl,
    FormLabel,
    FormErrorMessage, Input,
    FormHelperText,
    Stack,
    Flex,
    Checkbox,
    Link,
    useToast
} from "@chakra-ui/react";
import './login.scss'
import { useForm } from "react-hook-form";
import { Navigate, useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import * as MiddleWare from "../../../redux";
import loginUser from "../../../services/apicalls/company/login";
import { _login, _setauthtoken } from "../../../redux";
export const Login = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const toast= useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    const Navigator=useNavigate()
    const onSubmit=async (formValue:any)=>{
        setLoading(true);

        const {email, password } = formValue;

 
        
try {
    const res=  loginUser(email,password);
    // console.log(res)
    res.then((res: any)=>{
        
        dispatch(_login(res));
          dispatch(_setauthtoken(res.accessToken));
          
          Navigator('/dashboard')
         
    
          setLoading(false);
    }).catch((error: any)=>{
        
        
 

        toast({
            title: 'Authentication Failed',
            description: "Invalid Email or Password",
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        setLoading(false);
    }
    
    )
    
    
    // dispatch(_login(res));
    // console.log(res)
    // dispatch(_setauthtoken(res.accessToken));
    // dispatch(_setauthtoken(res.accessToken));
    // Navigator('/dashboard');
    // console.log("erro")
    return res

    // business logic goes here
} catch (error) {
    
    console.error(error) // from creation or business logic
}
    }
    return <HStack mt={100} pb={15} w="full" className="flexMobColumn">
        <Box position={"relative"} w={"50%"}   className="left">
            <Image src={"/assets/img/login-bg.png"} maxH={"500px"} />
            <Image src={"/assets/img/login-left-img.png"} position={"absolute"} left={"94px"} bottom={0} maxH={"400px"} />
        </Box>
        <Box w={"50%"} maxW={550} className={"right"}>
            <Heading color={"white"} fontSize={"2.7rem"} mb={3}>
                Log in to the <span className="last-latter">LINKD</span>
            </Heading>
            <Text color={"#9B9292"} fontSize={"18px"} >Welcome back! Log in with data to proceed</Text>
            <Box as="form" onSubmit={handleSubmit(onSubmit)}>
                <FormControl mt={68}>
                    <FormLabel htmlFor='email' fontSize={"1rem"} color="white" lineHeight={"25px"}>Email</FormLabel>
                    <Input  type='email'   placeholder="email@address.com" _placeholder={{
                        color: "#9B929280",
                        fontSize: "0.9rem"
                    }}
                        borderRadius={100}
                        border="none"
                        bg="#161A1D"
                        maxW={"25rem"}
                        color="white"
                        {...register("email", { required: true })}
                    />
                     {errors.email && (
              <FormHelperText color="red.500" ml={15}>
                Email is required
              </FormHelperText>
            )}
                </FormControl>
                <FormControl mt={30}>
                    <FormLabel htmlFor='password' fontSize={"1rem"} color="white" lineHeight={"25px"}>Password</FormLabel>
                    <Input id='email' type='password' placeholder="*********************" _placeholder={{
                        color: "#9B929280",
                        fontSize: "0.9rem"
                        
                    }}
                        borderRadius={100}
                        border="none"
                        bg="#161A1D"
                        maxW={"25rem"}
                        color="white" 
                        {...register("password", { required: true })}
                        />
                        {errors.password && (
              <FormHelperText color="red.500" ml={15}>
                Password is required
              </FormHelperText>
            )}
                </FormControl>
                <Flex mt="5"  maxW={"25rem"} justifyContent="space-between">
                    <FormControl display={"flex"} alignItems={"center"} columnGap={2}>
                       <Checkbox/> <Text color={"#9B9292"} fontSize="15px">Remember</Text>
                    </FormControl>
                    <FormControl  textAlign="right">
                       <Link href="/forgotpassword" textDecoration={"underline"} color={"#9B9292"} fontSize="15px">Forgot your password</Link>
                    </FormControl>
                </Flex>
                <FormControl mt={30}>
               
                    <Button type="submit" bg={"primary.default"} w="full" maxW={"25rem"} color={"white"} _hover={{bg:"primary._dark", color:"primary.default"}} borderRadius={100}>
                        LogIn
                    </Button>
             
                </FormControl>

            </Box>
        </Box>
    </HStack>

}
