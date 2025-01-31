import React from 'react';
import {  message, Popconfirm, PopconfirmProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface ReusablePopconfirmProps extends PopconfirmProps {
  onConfirm?: () => void;           
  onConfirmMessage?: string;        
  onCancelMessage?: string;         
  buttonText?: any;              
}

const DeletePopconfirm: React.FC<ReusablePopconfirmProps> = ({
  onConfirm,
  onConfirmMessage,
  onCancelMessage,
  buttonText,
  ...rest
}) => {

  // Handle confirm action
  const handleConfirm = () => {
    onConfirm();
  };

  // Handle cancel action
  const handleCancel = () => {
    message.error(onCancelMessage); // Show error message
  };

  return (
    <Popconfirm
      {...rest}  
      onConfirm={handleConfirm}
      onCancel={handleCancel} 
    >
      <DeleteOutlined className="text-red-500 cursor-pointer" />
    </Popconfirm>
  );
};

export default DeletePopconfirm;
