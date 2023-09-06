import React, {useState} from "react";
import axios from 'axios'; 
import {Button, Container, Form, FormControl} from "react-bootstrap";
const FileSaver = require('file-saver');

export default function FileUploader(props){
    const [file, setFile] = useState("");

    const onFileChange = event => { 
        // console.log(event.target.files[0]);
        setFile(event.target.files[0]);
    }; 

    const onFileUpload = () => { 
        const formData = new FormData(); 
        formData.append( 
          "myFile", 
          file, 
          file.name 
        );
       
        axios.post("/api/service/group/generate", formData).then(res => {
            let result_json = res.data;
            // console.log("result_json", result_json);

            let student = result_json.student;
            // console.log("students links: ", student);

            let teacher = result_json.teacher;
            // console.log("teacher links: ", teacher);

            let student_blob = new Blob([student], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(student_blob, 'sessionList.csv');

            let teacher_blob = new Blob([teacher], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(teacher_blob, 'teacherList.csv');
        });
    }; 

    return (
        <Container>
            <Form>
                <FormControl
                    onChange={onFileChange}
                    type="file"
                />

                <Button variant="success"
                    onClick={onFileUpload}>
                    Upload
                </Button>

            </Form>
        </Container>
    );
}