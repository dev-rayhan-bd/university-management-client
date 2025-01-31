import { FieldValues, SubmitHandler } from "react-hook-form";

import { Button, Col, Flex } from "antd";


import { toast } from "sonner";


import { TResponse } from "../../../types";
import { useAddRegisteredSemesterMutation, } from "../../../redux/features/admin/courseManagement.api";
import PHForm from "../../../Components/Form/PHForm";
import PHSelect from "../../../Components/Form/PHSelect";
import { semesterStatusOptions } from "../../../constants/semister";
import PHDatePicker from "../../../Components/Form/PHDatePicker";
import PHInput from "../../../Components/Form/PHInput";
import { useGetAllSemistersQuery } from "../../../redux/features/admin/academicManagement.api";

const SemesterRegistration = () => {
  const [addSemester] = useAddRegisteredSemesterMutation();
  const { data: academicSemester } = useGetAllSemistersQuery([
    { name: "sort", value: "year" },
  ]);
console.log(academicSemester);
  const academicSemesterOptions = academicSemester?.data?.map((item) => (    {

    value: item._id,
    label: `${item?.name} ${item?.year}`,
  }));

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading("Creating...");

    const semesterData = {
      ...data,
      minCredit: Number(data.minCredit),
      maxCredit: Number(data.maxCredit),
    };

    console.log(semesterData);

    try {
      const res = (await addSemester(semesterData)) as TResponse<any>;
      console.log(res);
      if (res.error) {
        toast.error(res.error.data.message, { id: toastId });
      } else {
        toast.success("Semester created", { id: toastId });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <PHForm onSubmit={onSubmit}>
          <PHSelect
            label="Academic Semester"
            name="academicSemester"
            options={academicSemesterOptions}
          />

          <PHSelect
            name="status"
            label="Status"
            options={semesterStatusOptions}
          />
          <PHDatePicker name="startDate" label="Start Date" />
          <PHDatePicker name="endDate" label="End Date" />
          <PHInput type="text" name="minCredit" label="Min Credit" />
          <PHInput type="text" name="maxCredit" label="Max Credit" />

          <Button htmlType="submit">Submit</Button>
        </PHForm>
      </Col>
    </Flex>
  );
};

export default SemesterRegistration;
