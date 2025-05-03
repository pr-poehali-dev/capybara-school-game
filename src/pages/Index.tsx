
import CapybaraSchool from "@/components/CapybaraSchool";

const Index = () => {
  return (
    <div className="min-h-screen bg-amber-50/50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-amber-800">Школа Капибар</h1>
          <p className="text-xl text-amber-600">
            Добро пожаловать в веселую обучающую игру о капибарах!
          </p>
        </div>
        
        <CapybaraSchool />
      </div>
    </div>
  );
};

export default Index;
