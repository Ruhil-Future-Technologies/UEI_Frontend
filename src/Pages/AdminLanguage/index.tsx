/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { toast } from 'react-toastify';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '../../hooks/useAPI';
import {
  commonStyle,
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import { ChildComponentProps } from '../StudentProfile';

interface Language {
  id: string;
  is_active?: number;
  language_name: string;
}

const AdminLanguage: React.FC<ChildComponentProps> = () => {
  const AdminId = localStorage.getItem('_id');
  const UuId = localStorage.getItem('user_uuid');
  interface Box {
    id: number;
    language_id: any;
    proficiency: any;
  }

  const context = useContext(NameContext);
  const { namecolor, activeForm, setActiveForm }: any = context;
  const { getData, postData, putData, deleteData } = useApi();
  const [alllanguage, setAllLanguage] = React.useState<Language[]>([]);
  // const [editFalg, setEditFlag] = useState<boolean>(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [, setInitialState] = useState<any | null>([]);
  const [error, setError] = useState<{
    [key: number]: { language_error: boolean; proficiency_error: boolean };
  }>({});
  const [checkChanges, setCheckChanges] = useState(false);
  const [editable, setEditable] = useState(true);
  const menuItems = ['read', 'write', 'both'];

  const addRow = () => {
    setBoxes((prevBoxes) => [
      ...prevBoxes,
      { id: 0, language_id: '', proficiency: '' },
    ]);
  };

  const deleterow = (id: any, indx: number) => {
    if (id !== 0) {
      deleteData(`/admin_language_known/delete/${id}`)
        .then((data: any) => {
          if (data.status) {
            toast.success('Language deleted successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    }
    setBoxes(boxes.filter((_box, index) => index !== indx));
  };

  useEffect(() => {
    getData(`${'language/list'}`)
      .then((data: any) => {
        if (data?.status) {
          const filteredData = data?.data?.languagees_data?.filter(
            (item: any) => item?.is_active === true,
          );
          setAllLanguage(filteredData || []);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    getData(`${'admin_language_known/get/' + UuId}`)
      .then((data: any) => {
        if (data?.status) {
          data.data.admin_language_known_data.map((item: any) => {
            const newBox: Box = {
              id: item.id,
              language_id: item.language_id,
              proficiency: item.proficiency,
            };
            if (!boxes.some((box) => box.id === newBox.id)) {
              setBoxes((prevBoxes) => [...prevBoxes, newBox]);
            }
          });
        } else if (data?.code === 404) {
          setBoxes([{ id: 0, language_id: '', proficiency: '' }]);
          // setEditFlag(true);
        } else {
          setBoxes([{ id: 0, language_id: '', proficiency: '' }]);
          toast.error(data?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  }, []);
  useEffect(() => {
    if (AdminId) {
      getData(`${'admin_language_known/get/' + AdminId}`).then(
        (response: any) => {
          if (response?.status) {
            const newLanageage =
              response?.data?.admin_language_known_data?.filter((items: any) =>
                boxes.some((box: Box) => box.id === items.id || box.id == 0),
              );

            const newBoxes: Box[] = newLanageage.map((item: any) => ({
              id: item.id,
              language_id: item.language_id,
              proficiency: item.proficiency,
            }));

            if (newBoxes.length > 0) {
              setBoxes((preBoxes: Box[]) => [
                ...preBoxes.filter((box: Box) => box.id != 0),
                ...newBoxes.filter(
                  (newbox: Box) =>
                    !preBoxes.some((item: Box) => item.id === newbox.id),
                ),
              ]);
              setInitialState((prevBoxes: Box[]) => [
                ...prevBoxes,
                ...newBoxes.filter(
                  (newBox: Box) =>
                    !prevBoxes.some((box: Box) => box.id === newBox.id),
                ),
              ]);
            }
            setEditable(false);
          } else if (response?.code == 401) {
            setEditable(true);
          }
        },
      );
    }
  }, [activeForm]);

  const saveLanguage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let valid = true;

    boxes.forEach((box, index) => {
      if (!box.language_id || !box.proficiency) {
        valid = false;
        setError((prevError) => ({
          ...prevError,
          [index]: {
            language_error: !box.language_id,
            proficiency_error: !box.proficiency,
          },
        }));
      }
    });

    if (!valid) return; // Don't proceed if validation fails
    setActiveForm((prev: number) => prev + 1);

    const promises = boxes.map((box) => {
      const payload = {
        id: box.id,
        admin_id: AdminId,
        language_id: box.language_id,
        proficiency: box.proficiency,
      };
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      if (checkChanges) {
        if (box.id === 0) {
          return postData('admin_language_known/add', formData);
        } else {
          return putData('admin_language_known/edit/' + box.id, formData);
        }
      } else {
        return Promise.resolve({ status: 204 });
      }
    });
    try {
      const results: any = await Promise.all(promises);

      const successfulResults = results.filter(
        (res: { status: number }) => res.status,
      );
      if (successfulResults?.length > 0) {
        if (checkChanges) {
          if (editable) {
            toast.success('Language saved successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
            setCheckChanges(false);
          } else {
            setCheckChanges(false);
            toast.success('Language updated successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          }
        } else {
          //else
        }
      }
    } catch (e: any) {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  const handleChange = (event: SelectChangeEvent<string>, index: number) => {
    const { value } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, language_id: value } : box,
      ),
    );
    validateFields(index, 'language');
    setCheckChanges(true);
  };

  const handleChange1 = (event: SelectChangeEvent<string>, index: number) => {
    const { value } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, proficiency: value } : box,
      ),
    );
    validateFields(index, 'proficiency');
    setCheckChanges(true);
  };

  const validateFields = (index: number, field: string) => {
    setError((prevError) => ({
      ...prevError,
      [index]: {
        ...prevError[index],
        ...(field === 'language' && {
          language_error: !boxes[index].language_id,
        }),
        ...(field === 'proficiency' && {
          proficiency_error: !boxes[index].proficiency,
        }),
      },
    }));
  };

  return (
    <form>
      <p className="font-weight-bold profiletext mt-4">
        <b> Language Known</b>
      </p>
      {boxes.map((box, index) => (
        <div
          className="row d-flex justify-content-start align-items-center mt-4"
          key={index}
        >
          <div className="col form_field_wrapper ">
            <FormControl
              required
              sx={{
                m: 1,
                mt:
                  error[index]?.language_error && box.language_id == '' ? 4 : 1,
              }}
              fullWidth
            >
              <InputLabel id={`language-label-${box.id}`}>Language</InputLabel>
              <Select
                labelId={`language-label-${box.id}`}
                data-testid={`language-${box.id}`}
                id={`language-select-${box.id}`}
                name={`language_${box.id}`}
                value={box.language_id}
                label="Language *"
                sx={{
                  backgroundColor: '#f5f5f5',
                  '& .MuiSelect-icon': {
                    color: fieldIcon(namecolor),
                  },
                }}
                onChange={(e) => {
                  handleChange(e, index);
                }}
                onBlur={() => validateFields(index, 'language')}
              >
                {alllanguage
                  .filter((lang) => lang.id === box.language_id)
                  .map((lang) => (
                    <MenuItem
                      key={lang.id}
                      value={lang.id}
                      disabled
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        '&:hover': {
                          backgroundColor: inputfieldhover(namecolor),
                        },
                        '&.Mui-selected': {
                          backgroundColor: inputfield(namecolor),
                        },
                        '&.Mui-selected, &:focus': {
                          backgroundColor: inputfield(namecolor),
                        },
                      }}
                    >
                      {lang.language_name}
                    </MenuItem>
                  ))}
                {/* Render the rest of the languages except the ones already selected in other boxes */}
                {alllanguage
                  .filter(
                    (lang) =>
                      lang.id !== box.language_id &&
                      !boxes.some((b) => b.language_id === lang.id),
                  )
                  .map((lang) => (
                    <MenuItem
                      key={lang.id}
                      value={lang.id}
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        '&:hover': {
                          backgroundColor: inputfieldhover(namecolor),
                        },
                        '&.Mui-selected': {
                          backgroundColor: inputfield(namecolor),
                        },
                        '&.Mui-selected, &:focus': {
                          backgroundColor: inputfield(namecolor),
                        },
                      }}
                    >
                      {lang.language_name}
                    </MenuItem>
                  ))}
              </Select>
              {error[index]?.language_error && box.language_id == '' && (
                <FormHelperText style={{ color: 'red' }}>
                  Language is required
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col form_field_wrapper">
            <FormControl
              required
              sx={{
                m: 1,
                mt:
                  error[index]?.proficiency_error && box.proficiency == ''
                    ? 4
                    : 1,
              }}
              fullWidth
            >
              <InputLabel id={`proficiency-label-${box.id}`}>
                Proficiency
              </InputLabel>
              <Select
                labelId={`proficiency-label-${box.id}`}
                data-testid={`proficiency_${box.id}`}
                id={`proficiency-select-${box.id}`}
                name={`proficiency_${box.id}`}
                value={box.proficiency}
                label="Proficiency *"
                sx={{
                  backgroundColor: '#f5f5f5',
                  '& .MuiSelect-icon': {
                    color: fieldIcon(namecolor),
                  },
                }}
                onChange={(e) => {
                  handleChange1(e, index);
                }}
                onBlur={() => validateFields(index, 'proficiency')}
              >
                {menuItems.map((item) => (
                  <MenuItem key={item} value={item} sx={commonStyle(namecolor)}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              {error[index]?.proficiency_error && box.proficiency == '' && (
                <FormHelperText style={{ color: 'red' }}>
                  Proficiency is required
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="col form_field_wrapper d-flex">
            <IconButton
              onClick={addRow}
              sx={{
                width: '35px',
                height: '35px',
                color: fieldIcon(namecolor),
              }}
            >
              <AddCircleOutlinedIcon />
            </IconButton>
            {boxes.length !== 1 && (
              <IconButton
                onClick={() => deleterow(box.id, index)}
                sx={{
                  width: '35px',
                  height: '35px',
                  color: fieldIcon(namecolor),
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="mt-3 d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="btn btn-outline-dark prev-btn px-lg-4  rounded-pill"
              onClick={() => {
                setActiveForm((prev: number) => prev - 1);
              }}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-dark px-lg-5 px-4  ms-auto d-block rounded-pill next-btn"
              onClick={(e: any) => saveLanguage(e)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminLanguage;
