import { useEffect, useState } from "react";
import Input from "../../pages/create/Input";
import Select from "../../pages/create/Select";
import { typeOptions, statusOptions, sortOptions } from "../../utils/constants";
import api from "../../utils/api";
import { useDispatch } from "react-redux";
import { setJobs } from "../../redux/slices/jobSlice";

const Filter = () => {
  const [text, setText] = useState();
  const [debouncedText, setDebouncedText] = useState();
  const [status, setStatus] = useState();
  const [type, setType] = useState();
  const [sort, setSort] = useState();

  const dispatch = useDispatch();

  /*
   * * Debounce
   * Bir fonksiyonun çok sık gerçekleşmesini önlemek için kullanılır. Her tuşa basıldığında arama yapmak yerine, kullanıcının yazmayı bitirmesini bekleyip, belirli bir süre geçtikten sonra işlemi yapar.
   * Bu işlem performansı arttırıp gereksiz ağ isteklerini ve renderları önler.
   */

  useEffect(() => {
    if (text === undefined) return;

    // her tuş vuruşunda bir sayaç başlayacak ve
    // sayaç bitiminde elde edilen inputtaki metin state'e aktarılacak
    const id = setTimeout(() => {
      setDebouncedText(text);
    }, 600);

    // eğer süre bitmeden useEffect tekrar çalışırsa (yani yeni tuşa basılırsa ) önceki sayacı iptal edecez
    return () => clearTimeout(id);
  }, [text]);

  // filtrelere göre api'dan verileri alıp reducer'a aktarıyoruz.
  useEffect(() => {
    const params = {
      q: debouncedText,
      status,
      type,
      _sort: sort === "a-z" || sort === "z-a" ? "company" : "date",
      _order: sort === "a-z" || sort === "En Eski" ? "asc" : "desc",
    };
    api
      .get("/jobs", { params })
      .then((res) => dispatch(setJobs(res.data)))
      .catch((err) => console.log(err));
  }, [debouncedText, status, type, sort]);

  return (
    <div className="filter-sec">
      <h2>Filtreleme Formu</h2>

      <form>
        <Input label="Ara" handleChange={(e) => setText(e.target.value)} />
        <Select
          label="Durum"
          options={statusOptions}
          handleChange={(e) => setStatus(e.target.value)}
        />
        <Select
          label="Tür"
          options={typeOptions}
          handleChange={(e) => setType(e.target.value)}
        />
        <Select
          label="Sırala"
          options={sortOptions}
          handleChange={(e) => setSort(e.target.value)}
        />

        <div className="btn-wrapper">
          <button className="button">Filtreleri Sıfırla</button>
        </div>
      </form>
    </div>
  );
};

export default Filter;
