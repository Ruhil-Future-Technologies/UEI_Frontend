import React, { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import { QUERY_KEYS_STUDENT } from "../../utils/const";
import { toast } from "react-toastify";
import FullScreenLoader from "../Loader/FullScreenLoader";
import images_man from "../../assets/img/images_man.png";
import images_female from "../../assets/img/images_female.png";
import AvatarModal from "../../Components/AvatarModal/AvatarModal";
import maleAvatar from '../../assets/avatar/images_man.png';
import femaleAvatar from '../../assets/avatar/images_female.png';
import femaleAvatar1 from '../../assets/avatar/images_female1.png';
import femaleAvatar2 from '../../assets/avatar/images_female2.png';
import femaleAvatar3 from '../../assets/avatar/images_female3.png';
import femaleAvatar4 from '../../assets/avatar/images_female4.png';
import femaleAvatar5 from '../../assets/avatar/images_female5.png';
import maleAvatar1 from '../../assets/avatar/images_man1.png';
import maleAvatar2 from '../../assets/avatar/images_man2.png';
import maleAvatar3 from '../../assets/avatar/images_man3.png';
import maleAvatar4 from '../../assets/avatar/images_man4.png';
import maleAvatar5 from '../../assets/avatar/images_man5.png';
import maleAvatar6 from '../../assets/avatar/images_man6.png';
import NameContext from "../Context/NameContext";
import { inputfieldtext } from "../../utils/helpers";

// import { QUERY_STUDENT_PROFILE_KEYS } from '../../utils/const';
interface PreviewStudentProfileProps {
  editProfile: () => void;
  handleStep: React.Dispatch<React.SetStateAction<number>>;
}
interface StudentPayload {
  student_login_id: string | null;
  first_name?: string;
  last_name?: string;
  gender?: string;
  dob?: string | null;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  pic_path: string;
  aim?: string;
}

const PreviewStudentProfile: React.FC<PreviewStudentProfileProps> = ({ editProfile, handleStep }) => {
  const context = useContext(NameContext);
  let StudentId = localStorage.getItem("_id");
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const {setProImage,namecolor }:any = context;
  const [profileData, setProfileData] = useState<any>({});
  const [basicinfoPercentage, setbasicinfoPercentage] = useState<number>(0);
  const [addressPercentage, setaddressPercentage] = useState<number>(0);
  const [languagePercentage, setlanguagePercentage] = useState<number>(0);
  const [academichistoryPercentage, setacademichistoryPercentage] =
    useState<number>(0);
  const [contactPercentage, setcontactPercentage] = useState<number>(0);
  const [hobbyPercentage, sethobbyPercentage] = useState<number>(0);
  const [subjectPercentage, setsubjectPercentage] = useState<number>(0);
  const [profileImage, setprofileImage] = useState<any>();
  const [editFalg, setEditFlag] = useState<boolean>(false);
  const { getData, loading, postFileData,postData,putData } = useApi();
  const [isHovered, setIsHovered] = useState(false);
  const countKeysWithValue = (obj: any): number => {
    return Object.keys(obj).filter(
      (key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== ""
    ).length;
  };

  const callAPI = async () => {
    getData(`${profileURL}/${StudentId}`)
      .then((data: any) => {
        if (data.data) {
          setProfileData(data?.data);
          // let basic_info = data?.data?.basic_info;
          let basic_info = {
            aim: data?.data?.basic_info?.aim,
            dob: data?.data?.basic_info?.dob,
            father_name: data?.data?.basic_info?.father_name,
            first_name: data?.data?.basic_info?.first_name,
            gender: data?.data?.basic_info?.gender,
            id: data?.data?.basic_info?.id,
            is_active: data?.data?.basic_info?.is_active,
            // is_kyc_verified: data?.data?.basic_info?.is_kyc_verified,
            last_modified_datetime: data?.data.basic_info?.last_modified_datetime,
            last_name: data?.data?.basic_info?.last_name,
            mother_name: data?.data?.basic_info?.mother_name,
            student_registration_no: data?.data?.basic_info?.student_registration_no
          };
          let address = data?.data?.address;
          let language = data?.data?.language_known;
          let academic_history = data?.data?.academic_history;
          let contact = data?.data?.contact;
          let subject_preference = data?.data?.subject_preference;
          let hobby = data?.data?.hobby;
          if (basic_info && Object.keys(basic_info)?.length > 0) {
            // console.log("test pp",Object.keys(basic_info)?.length > 0 ,data?.data?.pic_path)
            if (data?.data?.pic_path !== "" && data?.data?.pic_path !== undefined) {

              getData(`${"upload_file/get_image/" + data?.data?.pic_path}`)
                .then((imgdata: any) => {
                  setprofileImage(imgdata?.data);
                })
                .catch((e) => {

                });
            }

            let totalcount = Object.keys(basic_info).length;
            let filledCount = countKeysWithValue(basic_info);
            let percentage = (filledCount / totalcount) * 100;
            setbasicinfoPercentage(percentage);
          }
          if (address && Object.keys(address).length > 0) {
            let totalcount = Object.keys(address).length;
            let filledCount = countKeysWithValue(address);
            let percentage = (filledCount / totalcount) * 100;
            setaddressPercentage(percentage);
          }
          if (language && Object.keys(language).length > 0) {
            let totalhobbycount = 0;
            let filledhobbyCount = 0;
            if (hobby && Object.keys(hobby).length > 0) {
              totalhobbycount = Object.keys(hobby).length;
              filledhobbyCount = countKeysWithValue(hobby);
            }
            let totalcount = Object.keys(language).length + totalhobbycount;
            let filledCount = countKeysWithValue(language) + filledhobbyCount;
            let percentage = (filledCount / totalcount) * 100;
            setlanguagePercentage(percentage);
          }
          if (academic_history && Object.keys(academic_history).length > 0) {
            if (academic_history?.institution_type === "school") {
              delete academic_history?.course_id;
              delete academic_history?.institute_id;
              delete academic_history?.institution_name;
              delete academic_history?.learning_style;
              delete academic_history?.university_name;
              delete academic_history?.year;
              academic_history?.board !== "state_board" &&
                delete academic_history?.state_for_stateboard;
            } else {
              delete academic_history?.board;
              delete academic_history?.class_id;
              delete academic_history?.state_for_stateboard;
            }
            let totalcount = Object.keys(academic_history).length;
            let filledCount = countKeysWithValue(academic_history);
            let percentage = (filledCount / totalcount) * 100;
            setacademichistoryPercentage(percentage);
          }
          if (contact && Object.keys(contact).length > 0) {
            let totalcount = Object.keys(contact).length;
            let filledCount = countKeysWithValue(contact);
            let percentage = (filledCount / totalcount) * 100;
            setcontactPercentage(percentage);
          }
          if (
            subject_preference &&
            Object.keys(subject_preference).length > 0
          ) {
            let totalcount = Object.keys(subject_preference).length;
            let filledCount = countKeysWithValue(subject_preference);
            let percentage = (filledCount / totalcount) * 100;
            setsubjectPercentage(percentage);
          }
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    callAPI();
  }, []);

  const redirectOnClick = (step: number) => {
    handleStep(step);
    editProfile();
  }
  // console.log("testing",profileData?.contact?.email_id)
  var userId = localStorage.getItem('userid');


  const handleMouseEnter = (event: any) => {
    event.target.style.color = 'blue';  // Example hover style
    event.target.style.fontSize = '.90rem'
  };

  const handleMouseLeave = (event: any) => {
    event.target.style.color = 'initial';  // Reset to initial style
    event.target.style.fontSize = '.77rem'
  };
  function toCamelCase(str: string) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match: string) {
      return match.toUpperCase();
    });
  }
  const genderCamelCase = profileData?.basic_info?.gender ? toCamelCase(profileData?.basic_info?.gender) : '';
  const getDefaultImage = (gender: string) => {
    if (gender === 'Male' || gender === 'male') {
      // return "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
      return images_man
    } else if (gender === 'Female' || gender === 'female') {
      // return "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp";
      return images_female
    } else {
      // return "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";
      return images_man
    }
  };
  // console.log("====",images_man)

  const [modalOpen, setModalOpen] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(profileImage);

  const handleImageClick = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  // const handleAvatarSelect = (avatar: any) => {
  //   console.log("---==",avatar)

  //   setSelectedImage(avatar);
  //   setModalOpen(false);
  // };
  const handleAvatarSelect = async (avatarUrl: string | URL | Request | any) => {
    try {
      const response = await fetch(avatarUrl);
      const blob = await response.blob();
      let filename = ''; // Initialize filename variable

      // Extract the original filename from the URL
      if (avatarUrl.startsWith('data:image')) {
        // If avatarUrl is a data URL
        const contentType = avatarUrl.split(';')[0].split(':')[1];
        const extension = contentType.split('/')[1];
        filename = `avatar_${Date.now()}.${extension}`;
      } else {

        const urlSegments = avatarUrl.split('/');
        filename = urlSegments[urlSegments.length - 1];
      }
      
      const file = new File([blob], filename, { type: blob.type });

      const formData = new FormData();
      formData.append('file', file);

      const data = await postFileData('upload_file/upload', formData);

      if (data?.status === 200) {
        const datastudent:any = await  getData(`${"student/get/" + StudentId}`, StudentId);


        let payload = {
          student_login_id: StudentId,
          pic_path: filename, 
        };
     if (datastudent?.status === 404) {
      const dataadd = await postData(`${"student/add"}`, payload);
      if (dataadd?.status === 200) {
       await callAPI()
       setprofileImage(avatarUrl)
      }
     }else{
    const payload:StudentPayload  = {
        student_login_id: StudentId,
        first_name: datastudent?.data?.first_name,
        last_name: datastudent?.data?.last_name,
        gender: datastudent?.data?.gender,
        dob: datastudent?.data?.dob || null,
        father_name: datastudent?.data?.father_name,
        mother_name: datastudent?.data?.mother_name,
        guardian_name: datastudent?.data?.guardian_name,
        pic_path: filename,
        aim: datastudent?.data?.aim,
      };
      const dataadd = await putData(`${"student/edit/"}${StudentId}`, payload)
      if (dataadd?.status === 200) {
        await callAPI()
        setprofileImage(avatarUrl)
        setProImage(avatarUrl)
      }
     }

        // setSelectedImage(avatarUrl);
        setModalOpen(false);
      } else {
        toast.error(data?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    } catch (e: any) {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };
  const avatarsMap: { [key: string]: string[] } = {
    male: [
      maleAvatar,
      maleAvatar1,
      maleAvatar2,
      maleAvatar3,
      maleAvatar4,
      maleAvatar5,
      maleAvatar6,
    ],
    female: [
      femaleAvatar,
      femaleAvatar1,
      femaleAvatar2,
      femaleAvatar3,
      femaleAvatar4,
      femaleAvatar5,
    ],
    default: [
      maleAvatar,
      maleAvatar1,
      maleAvatar2,
      maleAvatar3,
      maleAvatar4,
      maleAvatar5,
      maleAvatar6,
      femaleAvatar,
      femaleAvatar1,
      femaleAvatar2,
      femaleAvatar3,
      femaleAvatar4,
      femaleAvatar5,
    ]
  };

  const gender: string = profileData?.gender?.toString() || 'default';
  const avatars = avatarsMap[gender.toLowerCase()];

  return (
    <>
      {/* {loading && <FullScreenLoader />} */}
      <div className="profile_section">
        <div className="card">
          <div className="card-body">
            <React.Fragment>
              {profileData ? (
                <section className="sectionbody">
                  <div className="container py-5">
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="card mb-4">
                          <span className="profilebody" style={{
                            display: "flex",
                            justifyContent: "flex-end",
                             padding: "10px"
                          }} >
                            <p style={{ cursor: "pointer" ,color:isHovered ?inputfieldtext(namecolor)  :inputfieldtext(namecolor)}}
                              onClick={handleImageClick}
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                              >
                              Select Avatar
                            </p>
                          </span>
                          <div className="card-body text-center profilebody">
                            <img
                              // src={
                              //   loading? '' : profileImage
                              //     ? profileImage
                              //     : (profileData?.gender === "Male" || profileData?.gender === "male") ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" :(profileData?.gender === "female" || profileData?.gender === "Female") ? "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp" :"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                              // }
                              // src={loading ? '' : profileImage ? profileImage : getDefaultImage(profileData?.gender)}
                              src={loading ? '' : profileImage ? profileImage : getDefaultImage(profileData?.basic_info?.gender)}
                              alt=""
                              className="rounded-circle img"
                              width="150px"
                              height="150px"

                            />
                            <h5 className="my-3">
                              {profileData?.basic_info?.first_name} {profileData?.basic_info?.last_name}
                            </h5>
                            <p className="text-muted mb-1 profiletext">
                              {/* {profileData?.gender}*/}
                              {genderCamelCase}
                            </p>
                            {/* {profileData?.address &&
                              Object.keys(profileData?.address).length > 0 && (
                                <p className="text-muted mb-4 profiletext">
                                  {profileData?.address?.address1} ,
                                  {profileData?.address?.address2} ,
                                  {profileData?.address?.district} ,
                                  {profileData?.address?.city} ,
                                  {profileData?.address?.state} ,
                                  {profileData?.address?.country} ,
                                  {profileData?.address?.pincode}
                                </p>
                              )} */}

                            <p className="mb-4">
                              <span className="text-primary font-italic me-1"></span>{" "}
                              Profile Completion Status
                            </p>
                            <p className="mb-1" style={{ fontSize: ".77rem", cursor: "pointer" }} onClick={() => redirectOnClick(0)} onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}>
                              Basic Information
                            </p>
                            <div
                              className="progress rounded"
                              style={{ height: "5px" }}
                            >
                              <div
                                className="progress-bar custom-progress-bar"
                                role="progressbar"
                                style={{ width: `${basicinfoPercentage}%` }}
                                aria-valuenow={basicinfoPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <span style={{display:"flex" , flexDirection:"row-reverse"}}>{`${Math.round(basicinfoPercentage)}%`}</span>
                            <p
                              className="mt-4 mb-1"
                              style={{ fontSize: ".77rem", cursor: "pointer" }}
                              onClick={() => redirectOnClick(1)}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              Address
                            </p>
                            <div
                              className="progress rounded"
                              style={{ height: "5px" }}
                            >
                              <div
                                className="progress-bar custom-progress-bar"
                                role="progressbar"
                                style={{ width: `${addressPercentage}%` }}
                                aria-valuenow={addressPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <span style={{display:"flex" , flexDirection:"row-reverse"}}>{`${Math.round(addressPercentage)}%`}</span>
                            <p
                              className="mt-4 mb-1"
                              style={{ fontSize: ".77rem", cursor: "pointer" }}
                              onClick={() => redirectOnClick(2)}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              Hobbies / Language Known
                            </p>
                            <div
                              className="progress rounded"
                              style={{ height: "5px" }}
                            >
                              <div
                                className="progress-bar custom-progress-bar"
                                role="progressbar"
                                style={{ width: `${languagePercentage}%` }}
                                aria-valuenow={languagePercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <span style={{display:"flex" , flexDirection:"row-reverse"}}>{`${Math.round(languagePercentage)}%`}</span>
                            <p
                              className="mt-4 mb-1"
                              style={{ fontSize: ".77rem", cursor: "pointer" }}
                              onClick={() => redirectOnClick(3)}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              Academic History
                            </p>
                            <div
                              className="progress rounded "
                              style={{ height: "5px" }}
                            >
                              <div
                                className="progress-bar custom-progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${academichistoryPercentage}%`,
                                }}
                                aria-valuenow={academichistoryPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <span style={{display:"flex" , flexDirection:"row-reverse"}}>{`${Math.round(academichistoryPercentage)}%`}</span>
                            <p
                              className="mt-4 mb-1"
                              style={{ fontSize: ".77rem", cursor: "pointer" }}
                              onClick={() => redirectOnClick(4)}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              Contact Details
                            </p>
                            <div
                              className="progress rounded mb-2"
                              style={{ height: "5px" }}
                            >
                              <div
                                className="progress-bar custom-progress-bar"
                                role="progressbar"
                                style={{ width: `${contactPercentage}%` }}
                                aria-valuenow={contactPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <span style={{display:"flex" , flexDirection:"row-reverse"}}>{`${Math.round(contactPercentage)}%`}</span>
                            <p
                              className="mt-4 mb-1"
                              style={{ fontSize: ".77rem", cursor: "pointer" }}
                              onClick={() => redirectOnClick(5)}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              Subject Preference
                            </p>
                            <div
                              className="progress rounded mb-2"
                              style={{ height: "5px" }}
                            >
                              <div
                                className="progress-bar custom-progress-bar"
                                role="progressbar"
                                style={{ width: `${subjectPercentage}%` }}
                                aria-valuenow={subjectPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              ></div>
                            </div>
                            <span style={{display:"flex" , flexDirection:"row-reverse"}}>{`${Math.round(subjectPercentage)}%`}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8">
                        <div className="card mb-4">
                          <div className="card-body profilebody">
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Full Name</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0 profileinnertext">
                                  {profileData?.basic_info?.first_name}{" "}
                                  {/* {profileData?.father_name}{" "} */}
                                  {profileData?.basic_info?.last_name}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Email</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0 profileinnertext">
                                  {/* {profileData?.contact?.email_id} */}
                                  {profileData?.contact?.email_id !== undefined ? profileData?.contact?.email_id?.includes('@') ? profileData?.contact?.email_id : "" : userId && userId?.includes('@') ? userId : ""}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Mobile</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0 profileinnertext">
                                  {profileData?.contact?.mobile_no_call !== undefined ? profileData?.contact?.mobile_isd_call + " " + profileData?.contact?.mobile_no_call : userId && !userId?.includes('@') ? userId : ""}

                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Whatsapp</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0 profileinnertext">
                                  {profileData?.contact?.mobile_no_watsapp !== undefined ? profileData?.contact?.mobile_no_watsapp !== "" ? profileData?.contact?.mobile_isd_watsapp + " " + profileData?.contact?.mobile_no_watsapp : "" : ""}
                                  {/* {profileData?.contact?.mobile_isd_watsapp}{" "}
                                  {profileData?.contact?.mobile_no_watsapp} */}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Address</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0 profileinnertext">
                                  {profileData?.address &&
                                    Object.keys(profileData?.address).length >
                                    0 && (
                                      <p className="text-muted mb-4 profileinnertext">
                                        {profileData?.address?.address1} ,
                                        {profileData?.address?.address2} ,
                                        {profileData?.address?.district} ,
                                        {profileData?.address?.city} ,
                                        {profileData?.address?.state} ,
                                        {profileData?.address?.country} ,
                                        {profileData?.address?.pincode}
                                      </p>
                                    )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <h1>Profile is Not Completed</h1>
              )}
              <AvatarModal
                open={modalOpen}
                handleClose={handleCloseModal}
                handleAvatarSelect={handleAvatarSelect}
                avatars={avatars}
              />
            </React.Fragment>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreviewStudentProfile;
