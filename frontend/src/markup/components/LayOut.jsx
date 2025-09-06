import Footer from "./Footer";
import Header from "./Header";

export default function LayOut({children}){
    return(
     <div>
           <Header/>
        {children}
        <Footer/>
     </div>
    )
}