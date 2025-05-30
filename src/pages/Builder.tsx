
import { useParams } from "react-router-dom";
import SimpleBuilder from "@/components/builder/SimpleBuilder";

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Invalid Website ID</h2>
          <p className="text-gray-600">Please check the URL and try again.</p>
        </div>
      </div>
    );
  }

  return <SimpleBuilder />;
};

export default Builder;
