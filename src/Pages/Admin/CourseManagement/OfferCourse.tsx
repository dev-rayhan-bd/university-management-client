import { Button, Col, Flex } from 'antd';

import { useGetAcademicFacultiesQuery } from '../../../redux/features/admin/academicManagement.api';

import { useState } from 'react';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import PHForm from '../../../Components/Form/PHForm';
import PHSelectWithWatch from '../../../Components/Form/PHSelectWithWatch';
import PHInput from '../../../Components/Form/PHInput';

const OfferCourse = () => {
  const [id, setId] = useState('');

  console.log('Inside parent component', id);

  const { data: academicFacultyData } = useGetAcademicFacultiesQuery(undefined);

  const academicSemesterOptions = academicFacultyData?.data?.result?.map((item) => ({
    value: item._id,
    label: item.name,
  }));

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <PHForm onSubmit={onSubmit}>
          <PHSelectWithWatch
            onValueChange={setId}
            label="Academic Semester"
            name="academicSemester"
            options={academicSemesterOptions}
          />
          <PHInput disabled={!id} type="text" name="test" label="Test" />
          <Button htmlType="submit">Submit</Button>
        </PHForm>
      </Col>
    </Flex>
  );
};

export default OfferCourse;
