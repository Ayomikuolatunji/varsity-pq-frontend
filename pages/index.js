import Search from "../components/Search";
import { useEffect, useState } from "react";
import { useGetUniversitiesQuery } from "../src/services/university";
import { useGetFacultiesQuery } from "../src/services/faculty";
import { useGetDepartmentsQuery } from "../src/services/department";
import { useGetYearsQuery } from "../src/services/year";
import { useGetLevelsQuery } from "../src/services/level";
import { useGetSemesterQuery } from "../src/services/semester";
import { Select } from "antd";
import axios from "axios";

const { Option } = Select;

export default function Home({ pqs }) {
  const [uniValue, setUniValue] = useState("");
  const [facultyValue, setFacultyValue] = useState("");
  const [departmentValue, setDepartmentValue] = useState("");
  const [yearValue, setYearValue] = useState("");
  const [levelValue, setLevelValue] = useState("");
  const [semesterValue, setSemesterValue] = useState("");
  const [courseValue, setCourseValue] = useState("");

  const [pqId, setPqId] = useState("");
  const [courses, setCourses] = useState([]);
  const [pastQuestion, setPastQuestion] = useState();

  const { data: universities } = useGetUniversitiesQuery();
  const { data: faculties } = useGetFacultiesQuery(uniValue);
  const { data: departments } = useGetDepartmentsQuery(facultyValue);
  const { data: years } = useGetYearsQuery();
  const { data: levels } = useGetLevelsQuery();
  const { data: semesters } = useGetSemesterQuery();

  // Get the list of course
  // filtered by the parameters
  const getCourse = async (
    university,
    faculty,
    department,
    level,
    year,
    semester
  ) => {
    const res = await fetch(
      `http://localhost:8000/course/?university__name=${university}&faculty__name=${faculty}&department__name=${department}&level__level=${level}&year__year=${year}&semester__semester=${semester}`
    );
    const data = await res.json();
    setCourses(data);
  };

  const getPastQuestionById = async (id) => {
    const data = await axios.get(`http://localhost:8000/past_question/${id}/`);
    setPastQuestion(data.data);
  };

  const setPq = (courseValue) => {
    for (let pq of pqs) {
      for (let details of pq.pq_details) {
        for (let course of courses) {
          if (
            course.id === details.course_id &&
            details.course_code === courseValue
          ) {
            setPqId(pq.id);
          } else {
            console.log("Not found");
          }
        }
      }
    }
  };

  console.log(pastQuestion);
  console.log(pqId);

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

  useEffect(() => {
    setPq(courseValue);
  }, [courseValue]);

  useEffect(() => {
    setCourseValue(null);
    setPqId("");
  }, [
    uniValue,
    facultyValue,
    departmentValue,
    levelValue,
    yearValue,
    semesterValue,
  ]);

  useEffect(() => {
    setDepartmentValue(null);
  }, [facultyValue]);

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
          disabled={uniValue === ""}
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
          value={departmentValue}
          disabled={facultyValue === ""}
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
          disabled={departmentValue === null}
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
          disabled={levelValue === ""}
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
          disabled={yearValue === ""}
        >
          {semesters?.map((semester) => (
            <Option key={semester.id} value={semester.semester}>
              {semester.semester}
            </Option>
          ))}
        </Search>

        <Search
          description={"Select Courses"}
          handleChange={(value) => setCourseValue(value)}
          value={courseValue}
          disabled={courses.length === 0}
        >
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
