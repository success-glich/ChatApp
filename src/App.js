import { useEffect, useRef, useState } from "react";
import {app} from "./firebase";
import {
	Box,
	Button,
	Container,
	VStack,
	Input,
	HStack,
} from "@chakra-ui/react";
import Message from "./Components/Message";


import {onAuthStateChanged, 
  getAuth,GoogleAuthProvider,
  signInWithPopup,
  signOut,
  
} from "firebase/auth";
import {getFirestore,addDoc,collection,
   serverTimestamp,
   onSnapshot,
   query,
   orderBy
} from "firebase/firestore"


const auth = getAuth(app);

const db = getFirestore(app);
const loginHandler = ()=>{
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth,provider);
}
const logoutHandler =()=>{
  signOut(auth)
}


function App() {
  const q = query(collection(db,"Messages"),orderBy("createdAt","asc"))
  const [user,setUser] = useState(false);
  const [message,setMessage]= useState("");
  const [messages,setMessages]= useState([]);

  const divForScrolls = useRef(null);
  const submitHandler = async (e)=>{
    e.preventDefault();
  
    try{
      setMessage(" ");

      await addDoc(collection(db,"Messages"),{
        text:message,
        uid:user.uid,
        url:user.photoURL,
        createdAt:serverTimestamp()
        
      })
      divForScrolls.current.scrollIntoView({behavior: "smooth"})
  
  
  
    }catch(error){
      alert(error);
    }
  }
  useEffect(()=>{

   const unsubscribe= onAuthStateChanged(auth,(data)=>{
      setUser(data);

    })

    // onSnapshot(collection(db,"Messages",(snap)=>{console.log(snap)}))
   const unsubscribeForMessage =  onSnapshot(q,(snap)=>{
      setMessages(
        snap.docs.map((item)=>{
          const id = item.id;
          return {id, ...item.data()}
        })


      )
    })
    return ()=>{
      unsubscribeForMessage();

      unsubscribe();
    }
  },[])

	return (
		<Box bg={"red.50"}>
      {
        user? 	<Container h={"100vh"} bg={"white"}>
				<VStack h="full" paddingY={"4"}>
					<Button onClick={logoutHandler} colorScheme={"red"} w={"full"}>
						Logout
					</Button>

					<VStack h={"full"} w={"full"} bg={"purple.100"} overflowY="auto" css={{"&::-webkit-scrollbar":{
            display:"none"
          }}}  >
           {
            messages.map(item=>(
              <Message key={item.id} user={item.uid===user.uid?"me":"other"} text={item.text} uri ={item.uri}/>

            ))
           }
            <div  ref={divForScrolls}>

</div>
            </VStack>

           
					<form onSubmit={submitHandler} action="">
						<HStack>
							<Input value={message}
              onChange={(e)=>setMessage(e.target.value)}
								type="text"
								placeholder="Enter a Message .."
							/>
							<Button colorScheme={"purple"} type="submit">
								Send
							</Button>
						</HStack>
					</form>
				</VStack>
			</Container>: <VStack bg="white" justifyContent={"center"} alignItems={"center"} h ="100vh" >
      <Button onClick={loginHandler} colorScheme={"purple"}>
						Sign in With Google
					</Button>
      </VStack>
      }
		
		</Box>
	);
}

export default App;
