import Search from "../components/Search";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useGetUniversitiesQuery } from "../src/services/university";
import { useGetFacultiesQuery } from "../src/services/faculty";
import { useGetDepartmentsQuery } from "../src/services/department";
import { useGetYearsQuery } from "../src/services/year";
import { useGetLevelsQuery } from "../src/services/level";
import { useGetSemesterQuery } from "../src/services/semester";
import axios from "axios";

import { useRouter } from "next/router";

const { Option } = Select;

export default function Home({ pqs }) {
  const router = useRouter();

  const [uniValue, setUniValue] = useState("");
  const [facultyValue, setFacultyValue] = useState("");
  const [departmentValue, setDepartmentValue] = useState("");
  const [yearValue, setYearValue] = useState("");
  const [levelValue, setLevelValue] = useState("");
  const [semesterValue, setSemesterValue] = useState("");
  const [courses, setCourses] = useState([]);

  const { data: universities } = useGetUniversitiesQuery();
  const { data: faculties } = useGetFacultiesQuery(uniValue);
  const { data: departments } = useGetDepartmentsQuery(facultyValue);
  const { data: years } = useGetYearsQuery();
  const { data: levels } = useGetLevelsQuery();
  const { data: semesters } = useGetSemesterQuery();

  const handleSemesterChange = (value) => {
    setSemesterValue(value);
  };

  // Using axios to get the list of course
  // filtered by the parameters in the getCourse function
  const getCourse = async (
    university,
    faculty,
    department,
    level,
    year,
    semester
  ) => {
    const res = await axios.get(
      `http://localhost:8000/course/?university__name=${university}&faculty__name=${faculty}&department__name=${department}&level__level=${level}&year__year=${year}&semester__semester=${semester}`
    );
    setCourses(res.data);
  };

  useEffect(() => {
    getCourse(
      uniValue,
      facultyValue,
      departmentValue,
      levelValue,
      yearValue,
      semesterValue
    );
  }, [
    uniValue,
    facultyValue,
    departmentValue,
    levelValue,
    yearValue,
    semesterValue,
  ]);

  for (let pq of pqs) {
    for (let details of pq.pq_details) {
      for (let course of courses) {
        if (course.id === details.course_id) {
          console.log(pq.id);
        } else {
          console.log("No past question found");
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-y-7">
      <h1 className="text-4xl">Select Past Question</h1>
      <div className="grid grid-cols-3 gap-3">
        <Search
          handleChange={(value) => setUniValue(value)}
          description={"Select University"}
        >
          {universities?.map((university) => (
            <Option key={university.id} value={university.name}>
              {university.name}
            </Option>
          ))}
        </Search>

        <Search
          handleChange={(value) => setFacultyValue(value)}
          description={"Select Faculty"}
        >
          {faculties?.map((faculty) => (
            <Option key={faculty.id} value={faculty.name}>
              {faculty.name}
            </Option>
          ))}
        </Search>

        <Search
          handleChange={(value) => setDepartmentValue(value)}
          description={"Select Department"}
        >
          {departments?.map((department) => (
            <Option key={department.id} value={department.name}>
              {department.name}
            </Option>
          ))}
        </Search>

        <Search
          handleChange={(value) => setLevelValue(value)}
          description={"Select level"}
        >
          {levels?.map((level) => (
            <Option key={level.id} value={level.level}>
              {level.level}
            </Option>
          ))}
        </Search>

        <Search
          handleChange={(value) => setYearValue(value)}
          description={"Select Year"}
        >
          {years?.map((year) => (
            <Option key={year.id} value={year.year}>
              {year.year}
            </Option>
          ))}
        </Search>

        <Search
          handleChange={(value) => setSemesterValue(value)}
          description={"Select semester"}
        >
          {semesters?.map((semester) => (
            <Option key={semester.id} value={semester.semester}>
              {semester.semester}
            </Option>
          ))}
        </Search>

        <Search description={"Select Courses"}>
          {courses?.map((course) => (
            <Option key={course.id} value={course.course_code}>
              {course.course_code}
            </Option>
          ))}
        </Search>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const res = await fetch("http://localhost:8000/past_question/");
  const data = await res.json();
  return {
    props: {
      pqs: data,
    },
  };
};
