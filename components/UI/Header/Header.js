import Image from "next/image";
import "./Header.css";
import BgBanner from "@/public/bg_01.jpg";
import SearchForm from "@/components/Forms/SearchForm/SearchForm";

const Header = () => {
  return (
    <header>
      <Image
        src={BgBanner}
        alt="header background"
        fill
        placeholder="blur"
        priority
        sizes="(max-width: 50px) 2vw"
      />

      <div className="header_container">
        <div className="header_content">
          <h1
            style={{
              marginBottom: "30px",
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            The Best{" "}
            <span className="text-gradient-1">
              Image Gallery free stock photos
            </span>
            , royalty &nbsp;
            <span className="text-gradient-2">free images</span> share by{" "}
            <span className="text-gradient-3">Images Gellery</span>
          </h1>

          <div className="header_search">
            <SearchForm />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
