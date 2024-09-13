import BlinkCard from "@/components/BlinkCard";

export default function Blink() {
  return (
    <div className= "w-screen h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(5,0,5,0.85) 30%, rgba(15,1,4,0.95) 70%), url(img.png)`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <BlinkCard/>
    </div>
  );
}