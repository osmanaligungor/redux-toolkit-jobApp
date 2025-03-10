import { statusOptions, typeOptions } from "../../utils/constants";
import Input from "./Input";
import Select from "./Select";
import "./create.scss";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createJob } from "../../redux/slices/jobSlice";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // form gönderilince
  const handleSubmit = (e) => {
    e.preventDefault();

    // inputlardan verileri alıyoruz
    const formData = new FormData(e.target);

    const jobData = Object.fromEntries(formData.entries());

    // tarih ekle
    jobData.date = Date.now();

    // api'a post isteği at
    api
      .post("/jobs", jobData)
      .then((res) => {
        dispatch(createJob(res.data));
        toast.success("Başvuru Oluşturuldu");
        navigate("/");
      })
      .catch((err) => {
        toast.error("Başvuru Oluşturma Başarısız");
      });
  };
  return (
    <div className="add-page">
      <section className="container">
        <h2>Yeni İş Ekle</h2>

        <form onSubmit={handleSubmit}>
          <Input label="Pozisyon" name="position" />
          <Input label="Şirket" name="company" />
          <Input label="Lokasyon" name="location" />
          <Select label="Durum" name="status" options={statusOptions} />
          <Select label="Tür" name="type" options={typeOptions} />

          <div className="btn-wrapper">
            <button className="button">Oluştur</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Create;
