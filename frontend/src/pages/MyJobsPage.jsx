import React, { useState, useEffect } from "react";
import MyJobsCard from "@/components/MyJobsCard";
import { useSelector } from "react-redux";

const MyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector( state => state.auth.userData)

  // Fake data for demonstration
  const fakeJobs = [
    {
      _id: "678e98a22cffe73a08f42240",
      jobDetails: {
        _id: "6789cb515d17fa3ecaca63e7",
        title: "Node.js Developer",
        location: "Pune",
        overview: "Backend development using Node.js and Express.",
      },
    },
    {
      _id: "678e98a22cffe73a08f42241",
      jobDetails: {
        _id: "6789cb515d17fa3ecaca63e8",
        title: "React Developer",
        location: "Remote",
        overview: "Frontend development using React and Tailwind CSS.",
      },
    },
    {
      _id: "678e98a22cffe73a08f42242",
      jobDetails: {
        _id: "6789cb515d17fa3ecaca63e9",
        title: "Full Stack Developer",
        location: "Bangalore",
        overview: "Full stack development using MERN stack.",
      },
    },
  ];

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use fake data
      //setJobs(fakeJobs);

      // Uncomment below for actual API call
      document.cookie = `accessToken=${localStorage.getItem('accessToken')}; path=/;`;
      const response = await fetch("http://localhost:8001/v1/application/get-applicants-job", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include the token in the header
        },
        withCredentials: true, // If cookies are also needed
      });
      console.log(localStorage.getItem('accessToken'));
      //console.log("cookies : "+cookie);
      
     

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const result = await response.json();

      if (result.success) {
        console.log(result.data);
        
        // console.log(result.data[0].status);
        
        setJobs(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch jobs");
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if(user == null){
    console.log(user);
    return(
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">My Jobs</h1>
        
      
          <p className="text-center mt-4">Please Login First!</p>
        
       
      </div>
    )
  }else{
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">My Jobs</h1>
        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
        {!loading && !error && jobs.length === 0 && (
          <p className="text-center mt-4">No jobs found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <MyJobsCard key={job._id} jobDetails={job.jobDetails} status={job.status} />
          ))}
        </div>
      </div>
    );
  };
  
  }

  
export default MyJobsPage;