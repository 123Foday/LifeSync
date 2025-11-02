import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";

const AddHospital = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1-5 Years");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Hospital");
  const [degree, setDegree] = useState("Joint Commission International (JCI)");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const hospitalTypes = [
    "General Hospital",
    "Specialist Hospital",
    "Teaching Hospital",
    "Private Hospital",
    "Government Hospital",
    "Community Health Center",
    "Children's Hospital",
    "Maternity Hospital",
    "Mental Health Facility",
    "Rehabilitation Center"
  ];

  const certifications = [
    "Joint Commission International (JCI)",
    "National Healthcare Safety Network (NHSN)",
    "International Organization for Standardization (ISO)",
    "College of Medicine and Allied Health Sciences (COMAHS)",
    "West African College of Physicians (WACP)",
    "Sierra Leone Medical and Dental Council (SLMDC)"
  ];

  const experienceRanges = [
    "1-5 Years",
    "5-10 Years",
    "10-15 Years",
    "15-20 Years",
    "20+ Years"
  ];

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // console.log formData
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-hospital",
        formData,
        { headers: { atoken: aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setAbout("");
        setFees("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Hospital</h1>
      
      <form onSubmit={onSubmitHandler} className="bg-white rounded-xl shadow-sm p-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <label htmlFor="doc-img" className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-2 border-blue-100 group-hover:border-blue-300 transition-all">
              <img
                className="w-full h-full object-cover"
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt=""
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm">Change</span>
            </div>
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            className="hidden"
            accept="image/*"
          />
          <div>
            <h2 className="text-lg font-medium text-gray-800">Hospital Image</h2>
            <p className="text-sm text-gray-500">Upload hospital logo or building image</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Hospital name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Hospital Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Hospital password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Years In Service</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-2"
                name=""
                id=""
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
                <option value="15 Year">15 Year</option>
                <option value="20 Years">20 Years</option>
                <option value="25 Years">25 Years</option>
                <option value="30 Years">30 Years</option>
                <option value="35 Years">35 Years</option>
                <option value="40 Years">40 Years</option>
                <option value="45 Years">45 Years</option>
                <option value="50 Years">50 Years</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2"
                type="number"
                placeholder="fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Category</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-3 py-2"
                name=""
                id=""
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Mission/Faith-Based">Mission/Faith-Based</option>
                <option value="NGO/Community">NGO/Community</option>
                <option value="Military/Police">Military/Police</option>
                <option value="Specialized/Teaching">
                  Specialized/Teaching
                </option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Accreditation / Affiliation</p>
              <select
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2"
              >
                <option value="College of Medicine and Allied Health Sciences (COMAHS)">
                  College of Medicine and Allied Health Sciences (COMAHS)
                </option>
                <option value="Sierra Leone Medical and Dental Council">
                  Accredited by the Sierra Leone Medical and Dental Council
                </option>
                <option value="Ministry of Health & Sanitation (MoHS)">
                  Accredited by Ministry of Health & Sanitation (MoHS)
                </option>
                <option value="University of Sierra Leone (USL)">
                  University of Sierra Leone (USL)
                </option>
                <option value="Other">Others</option>
              </select>

              {/* show input when 'Other' is selected */}
              {degree === "Other" && (
                <input
                  onChange={(e) => setDegree(e.target.value)}
                  value={degree}
                  className="border rounded px-3 py-2 mt-2"
                  type="text"
                  placeholder="Enter Accreditation / Affiliation"
                  required
                />
              )}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 1"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address 2"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Hospital</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            placeholder="write about hospital..."
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Hospital
        </button>
      </form>
    </div>
  );
};

export default AddHospital;
