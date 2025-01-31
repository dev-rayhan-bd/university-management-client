import { Controller, FieldValues, SubmitHandler } from "react-hook-form";

import { Button, Col, Divider, Form, Input, Row } from "antd";

import { bloodGroupOptions, genderOptions } from "../../../constants/global";

import {
  useGetAcademicDepartmentsQuery,
  useGetAllSemistersQuery,
} from "../../../redux/features/admin/academicManagement.api";
import { useAddStudentMutation } from "../../../redux/features/admin/userManagement.api";
import PHForm from "../../../Components/Form/PHForm";
import PHInput from "../../../Components/Form/PHInput";
import PHSelect from "../../../Components/Form/PHSelect";
import PHDatePicker from "../../../Components/Form/PHDatePicker";

import { toast } from "sonner";
import { TAcademicSemester, TResponse } from "../../../types";

// const studentDummyData = {
//   password: 'student123',
//   student: {
//     name: {
//       firstName: 'I am ',
//       middleName: 'Student',
//       lastName: 'Number 1',
//     },
//     gender: 'male',
//     dateOfBirth: '1990-01-01',
//     bloogGroup: 'A+',

//     email: 'student3@gmail.com',
//     contactNo: '1235678',
//     emergencyContactNo: '987-654-3210',
//     presentAddress: '123 Main St, Cityville',
//     permanentAddress: '456 Oak St, Townsville',

//     guardian: {
//       fatherName: 'James Doe',
//       fatherOccupation: 'Engineer',
//       fatherContactNo: '111-222-3333',
//       motherName: 'Mary Doe',
//       motherOccupation: 'Teacher',
//       motherContactNo: '444-555-6666',
//     },

//     localGuardian: {
//       name: 'Alice Johnson',
//       occupation: 'Doctor',
//       contactNo: '777-888-9999',
//       address: '789 Pine St, Villageton',
//     },

//     admissionSemester: '65bb60ebf71fdd1add63b1c0',
//     academicDepartment: '65b4acae3dc8d4f3ad83e416',
//   },
// };

//! This is only for development
//! Should be removed
const studentDefaultValues = {
  name: {
    firstName: "I am ",
    middleName: "Student",
    lastName: "Number 1",
  },
  gender: "male",

  bloogGroup: "A+",

  contactNo: "1235678",
  emergencyContactNo: "987-654-3210",
  presentAddress: "123 Main St, Cityville",
  permanentAddress: "456 Oak St, Townsville",

  guardian: {
    fatherName: "James Doe",
    fatherOccupation: "Engineer",
    fatherContactNo: "111-222-3333",
    motherName: "Mary Doe",
    motherOccupation: "Teacher",
    motherContactNo: "444-555-6666",
  },

  localGuardian: {
    name: "Alice Johnson",
    occupation: "Doctor",
    contactNo: "777-888-9999",
    address: "789 Pine St, Villageton",
  },

  // admissionSemester: '6751bc80d1473b54a4a2d5bd',

  // academicDepartment: ' 6763ae172a805dba97db5254',
};

const CreateStudent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [
    addStudent,
    // { data, error }
  ] = useAddStudentMutation();

  // console.log({ data, error });

  const { data: sData, isLoading: sIsLoading } =
    useGetAllSemistersQuery(undefined);
  // console.log("semisterData",sData);
  const { data: dData, isLoading: dIsLoading } =
    useGetAcademicDepartmentsQuery(undefined);
  // console.log("department",dData);
  const semesterOptions = sData?.data?.map((item) => ({
    value: item._id,
    label: `${item.name} ${item.year}`,
  }));

  const departmentOptions = dData?.data?.result?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const studentData = {
      password: "student123",
      student: data,
    };
    // console.log(data);
    const toastId = toast.loading("Student Creating...");
    const formData = new FormData();
    try {
      formData.append("data", JSON.stringify(studentData));
      formData.append("file", data.profileImg);

      // console.log("appended formdata:==> ",JSON.stringify(studentData));
      const res = (await addStudent(formData)) as TResponse<
        TAcademicSemester[]
      >;
      if (res?.error) {
        toast.error(res?.error?.data?.message, { id: toastId });
      } else {
        toast.success("Student Created", { id: toastId });
      }
      //! This is for development
      //! Just for checking
      // console.log("appended formdata:==> ",Object.fromEntries(formData));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <Row justify="center">
      <Col span={24}>
        <PHForm onSubmit={onSubmit} defaultValues={studentDefaultValues}>
          <Divider>Personal Info.</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="name.firstName" label="First Name" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="name.middleName" label="Middle Name" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="name.lastName" label="Last Name" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect options={genderOptions} name="gender" label="Gender" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHDatePicker name="dateOfBirth" label="Date of birth" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect
                options={bloodGroupOptions}
                name="bloogGroup"
                label="Blood group"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <Controller
                name="profileImg"
                render={({ field: { onChange, value, ...field } }) => (
                  <Form.Item label="Picture">
                    <Input
                      type="file"
                      value={value?.fileName}
                      {...field}
                      onChange={(e) => {
                        // console.log(e.target.files?.[0]);
                        onChange(e.target.files?.[0]);
                      }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>
          <Divider>Contact Info.</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="email" label="Email" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="contactNo" label="Contact" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="emergencyContactNo"
                label="Emergency Contact"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="presentAddress"
                label="Present Address"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="permanentAddress"
                label="Permanent Address"
              />
            </Col>
          </Row>
          <Divider>Guardian</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="guardian.fatherName"
                label="Father Name"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="guardian.fatherOccupation"
                label="Father Occupation"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="guardian.fatherContactNo"
                label="Father ContactNo"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="guardian.motherName"
                label="Mother Name"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="guardian.motherOccupation"
                label="Mother Occupation"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="guardian.motherContactNo"
                label="Mother ContactNo"
              />
            </Col>
          </Row>
          <Divider>Local Guardian</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput type="text" name="localGuardian.name" label="Name" />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="localGuardian.occupation"
                label="Occupation"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="localGuardian.contactNo"
                label="Contact No."
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHInput
                type="text"
                name="localGuardian.address"
                label="Address"
              />
            </Col>
          </Row>
          <Divider>Academic Info.</Divider>
          <Row gutter={8}>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect
                options={semesterOptions}
                disabled={sIsLoading}
                name="admissionSemister"
                label="Admission Semister"
              />
            </Col>
            <Col span={24} md={{ span: 12 }} lg={{ span: 8 }}>
              <PHSelect
                options={departmentOptions}
                disabled={dIsLoading}
                name="academicDepartment"
                label="Admission Department"
              />
            </Col>
          </Row>

          <Button htmlType="submit">Submit</Button>
        </PHForm>
      </Col>
    </Row>
  );
};

export default CreateStudent;
