import React, {
  useCallback, useState, useEffect, useRef,
} from 'react';
import { Form, Input } from 'formik-antd';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Button, Image, message, Space } from 'antd';
import * as Yup from 'yup';
import { UploadOutlined } from '@ant-design/icons';
import postSlice from '../reducers/post';
import { addPost, uploadImages } from '../actions/post';
import { imageUrl } from '../config/config';

const PostSchema = Yup.object().shape({
  content: Yup.string()
    .min(5, '게시글은 5자 이상 입력하여 주십시오.')
    .required('게시글은 필수 입력 항목 입니다.'),
});

const PostForm = () => {
  const [action, setAction] = useState(null);
  const {
    imagePaths,
    addPostLoading,
    addPostDone,
    addPostError,
  } = useSelector((state) => state.post);
  const { id } = useSelector((state) => state.user.me);
  const dispatch = useDispatch();

  useEffect(() => {
    if (action) {
      if (addPostDone) {
        message.success('게시글이 등록되었습니다.').then();
      }
      if (addPostError) {
        message.error(JSON.stringify(addPostError, null, 4)).then();
      }
      action.setSubmitting(false);
      action.resetForm();
      setAction(null);
    }
  }, [addPostDone, addPostError]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (image) => {
      imageFormData.append('image', image);
    });
    dispatch(uploadImages(imageFormData));
  }, []);

  const onRemoveImage = useCallback((index) => () => {
    dispatch(postSlice.actions.removeImage(index));
  }, []);

  return (
    <Formik
      initialValues={{ content: '' }}
      validationSchema={PostSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const formData = new FormData();
        imagePaths.forEach((image) => {
          formData.append('image', image);
        });
        formData.append('content', values.content);
        dispatch(addPost(formData));
        setAction({ setSubmitting, resetForm });
      }}
    >
      <Form
        style={{ marginBottom: '20px' }}
        encType="multipart/form-data"
      >
        <Form.Item name="content">
          <Input.TextArea
            id="content"
            name="content"
            maxLength={140}
            autoSize={{ minRows: 3, maxRows: 5 }}
            placeholder="어떤 신기한 일이 있었나요?"
          />
        </Form.Item>
        <div>
          <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
        </div>
        <div style={{ marginTop: '5px', overflow: 'hidden' }}>
          <Button
            onClick={onClickImageUpload}
            style={{ float: 'left' }}
          >
            <UploadOutlined /> Click to Upload
          </Button>
          <Button
            type="primary"
            style={{ float: 'right' }}
            htmlType="submit"
            loading={addPostLoading}
          >
            올리기
          </Button>
        </div>
        <Space size={8}>
          {imagePaths.map((v, i) => (
            <div style={{ margin: '5px 0 5px 0' }}>
              <Image
                width={100}
                height={100}
                src={imageUrl ? `${imageUrl}/${id}/${v}` : v.replace(/\/thumb\//, '/original/')}
                alt={v}
              />
              <div style={{ marginTop: '5px' }}>
                <Button type="danger" onClick={onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          ))}
        </Space>
      </Form>
    </Formik>
  );
};

export default PostForm;
