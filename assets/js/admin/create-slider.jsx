class AddSlide extends React.Component {
  constructor(props) {
    super(props);
    this.addSlide = this.addSlide.bind(this);
  }

  addSlide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.addSlide(null);
  }

  render() {
    const buttonStyle = { margin: "20px 0" };
    return (
      <button
        onClick={this.addSlide}
        style={buttonStyle}
        className="button button-primary"
      >
        Add Slides
      </button>
    );
  }
}

class Slide extends React.Component {
  render() {
    const slide = this.props.slide;

    const style = {
      backgroundImage: `url('${slide.sizes.large.url}')`
    };
    return (
      <li id={slide.id}>
        <div className="image-bg" style={style}>
          <div className={slide.caption_position + " caption"}>
            <h2 className="post-title">{slide.title}</h2>
            {slide.caption}
          </div>
        </div>
      </li>
    );
  }
}

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.slider = null;
  }

  componentDidMount() {
    this.slider = jQuery("#srs-preview").unslider({
      autoplay: false,
      delay: 6000,
      infinite: false,
      arrows: {
        //  Unslider default behaviour
        prev:
          '<span class="unslider-arrow prev  he-chevron-circle-left"></span>',
        next:
          '<span class="unslider-arrow next  he-chevron-circle-right"></span>'
      }
    });
  }

  componentDidUpdate() {
    debugger;
    this.slider.data("unslider").calculateSlides();
  }

  render() {
    const style = { height: "300px", margin: "10px 0 0" };
    const style_empty = {
      height: "300px",
      border: "dashed 2px #FFF",
      margin: "10px 0",
      background: "#77caf4"
    };
    if (this.props.slides.length) {
      return (
        <div>
          <div
            className="srs-slider srs-preview"
            style={style}
            id="srs-preview"
          >
            <SliderInner slides={this.props.slides} />
          </div>
          <span>
            Note: This slider preview doesn't use the right sized images. This
            preview is only for reference and a work in progress.
          </span>
        </div>
      );
    } else {
      return (
        <div className="no-slides unslider" style={style_empty}>
          <div className="caption center">
            <h1>You have no slides :-(</h1>
            <p>Please add a slide</p>
          </div>
        </div>
      );
    }
  }
}

class SliderInner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.slides.map(slide => (
          <Slide slide={slide} key={"slide_" + slide.id.toString()} />
        ))}
      </ul>
    );
  }
}

class SlideDetails extends React.Component {
  constructor(props) {
    super(props);
    this.deleteSlide = this.deleteSlide.bind(this);
    this.moveSlideUp = this.moveSlideUp.bind(this);
    this.moveSlideDown = this.moveSlideDown.bind(this);
    this.updateSlideDetails = this.updateSlideDetails.bind(this);
    this.updateCheckBox = this.updateCheckBox.bind(this);
    this.makeSlideActive = this.makeSlideActive.bind(this);

    var file_frame;
  }

  updateSlideDetails(e) {
    const name = $(e.target).data("name");
    const value = $(e.target).val();
    var props = { [name]: value };
    this.props.updateSlideDetails(this.props.slide.id, props);
  }

  updateCheckBox(e) {
    const name = $(e.target).data("name");
    const value = $(e.target).val();
    var checked = e.target.checked;

    if (checked) {
      var props = { [name]: value };
    } else {
      var props = { [name]: false };
    }
    this.props.updateSlideDetails(this.props.slide.id, props);
  }

  deleteSlide(e) {
    e.preventDefault();
    this.props.deleteSlide(this.props.slide.id);
  }

  moveSlideUp(e) {
    e.preventDefault();
    this.props.moveSlide(this.props.slide.id, -1);
  }

  moveSlideDown(e) {
    e.preventDefault();
    this.props.moveSlide(this.props.slide.id, 1);
  }

  makeSlideActive(e) {
    var id = jQuery(e.currentTarget).data("index");

    var slider = jQuery("#srs-preview").unslider({
      autoplay: false,
      delay: 6000,
      infinite: false
    });
    slider.data("unslider").animate(id);
  }

  render() {
    const slide = this.props.slide;
    const options = {
      left: "Left",
      right: "Right",
      bottom_center: "Bottom Center",
      center: "Center"
    };
    const urlStyles = {
      width: "55%",
      float: "left",
      display: "inline-block",
      paddingRight: "10px",
      boxSizing: "border-box"
    };
    const urlOptionsStyles = {
      width: "22.5%",
      float: "left",
      display: "inline-block",
      marginTop: "1.8em"
    };
    const backGroundImage = {
      backgroundImage: `url(${slide.sizes.medium.url})`,
      padding: "12.5%",
      backgroundSize: "cover"
    };
    return (
      <div
        className="slide-details cf clearfix"
        data-index={this.props.index}
        onClick={this.makeSlideActive}
      >
        {/*<img src={slide.sizes.medium.url} className="alignleft" onClick={this.editSlide}/>*/}
        <div style={backGroundImage} className="alignleft">
          &nbsp;
        </div>
        <div className=" details">
          <input
            className=""
            type="text"
            data-name="title"
            value={slide.title}
            onChange={this.updateSlideDetails}
          />
          <textarea
            className=""
            type="text"
            data-name="caption"
            value={slide.caption}
            onChange={this.updateSlideDetails}
          />

          <label style={urlStyles}>
            Target URL
            <input
              className=""
              type="text"
              value={slide.anchor}
              data-name="anchor"
              defaultValue="#"
              onChange={this.updateSlideDetails}
            />
          </label>
          <label style={urlOptionsStyles}>
            <input
              className="alignleft"
              type="checkbox"
              value="_blank"
              data-name="target"
              onChange={this.updateCheckBox}
              checked={slide.target}
            />
            &nbsp;New window
          </label>

          <label style={urlOptionsStyles}>
            <input
              className="alignleft"
              type="checkbox"
              value="nofollow"
              onChange={this.updateCheckBox}
              data-name="rel"
              checked={slide.rel}
            />
            &nbsp; rel="nofollow"
          </label>
          <div className="clear" />
          <label>
            Caption position
            <select
              className=""
              type="text"
              value={
                slide.caption_position
                  ? slide.caption_position
                  : "bottom_center"
              }
              data-name="caption_position"
              onChange={this.updateSlideDetails}
            >
              {Object.keys(options).map((key, index) => (
                <option key={index} value={key}>
                  {options[key]}
                </option>
              ))}
            </select>
          </label>
          <div className="clear" />
          <div className="move-controls cf clear">
            <button onClick={this.moveSlideDown}>
              <span className="dashicons dashicons-arrow-down-alt" />
            </button>
            <button onClick={this.moveSlideUp}>
              <span className="dashicons dashicons-arrow-up-alt" />
            </button>
          </div>
          <button
            className="button button-secondary alignright"
            onClick={this.deleteSlide}
          >
            Delete slide
          </button>
        </div>
        <div className="clear" />
      </div>
    );
  }
}

class Slides extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="slides">
        {this.props.slides.map((slide, index) => (
          <SlideDetails
            slide={slide}
            key={"details_" + slide.id.toString()}
            editSlide={this.props.editSlide}
            deleteSlide={this.props.deleteSlide}
            moveSlide={this.props.moveSlide}
            updateSlideDetails={this.props.updateSlideDetails}
            index={index}
          />
        ))}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    const SLIDES = SLIDER ? SLIDER["slides"] : [];
    this.state = { slides: SLIDES, hash: {} };
    this.addSlide = this.addSlide.bind(this);
    this.handleAddSlide = this.handleAddSlide.bind(this);
    this.deleteSlide = this.deleteSlide.bind(this);
    this.moveSlide = this.moveSlide.bind(this);
    this.getSlideIndex = this.getSlideIndex.bind(this);
    this.updateSlideDetails = this.updateSlideDetails.bind(this);
    this.file_frame = false;
    this.id = null;
  }

  addSlide(id) {
    this.id = id;
    if (this.file_frame) {
      this.file_frame.open();
      return;
    }
    this.file_frame = wp.media.frames.file_frame = wp.media({
      title: "Select a image to upload",
      button: {
        text: "Add selected images to slider"
      },
      multiple: true
    });

    this.file_frame.on("select", () => {
      var slides = this.file_frame.state().get("selection");
      var cleaned_slides = [];
      slides.map(slide => {
        slide = (({
          id,
          title,
          filesizeInBytes,
          height,
          width,
          sizes,
          caption,
          description
        }) => ({
          id,
          title,
          filesizeInBytes,
          height,
          width,
          sizes,
          caption,
          description
        }))(slide.attributes);

        cleaned_slides.push(slide);
      });
      this.handleAddSlide(cleaned_slides);
    });

    // Select the attachment when the frame opens
    this.file_frame.on("open", () => {
      var selection = this.file_frame.state().get("selection");
      selection.reset(this.id ? [wp.media.attachment(this.id)] : []);
    });
    this.file_frame.open();
  }

  deleteSlide(id) {
    let slides = this.state.slides.slice(0);
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].id === id) {
        slides.splice(i, 1);
        break;
      }
    }
    this.setState({
      slides: slides
    });
  }

  moveSlide(id, direction) {
    let slides = this.state.slides.slice(0);
    var index = this.getSlideIndex(id);
    var slide = slides[index];
    slides.splice(index, 1);
    slides.splice(index + direction, 0, slide);
    this.setState({
      slides: slides
    });
  }

  getSlideIndex(id) {
    const slides = this.state.slides;
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].id === id) {
        return i;
      }
    }
  }

  updateSlideDetails(id, props) {
    let slides = this.state.slides.slice(0);
    var index = this.getSlideIndex(id);
    var slide = slides[index];
    slide = JSON.parse(JSON.stringify(Object.assign(slide, props)));
    slides[index] = slide;
    this.setState({
      slides: slides
    });
  }

  handleAddSlide(newSlides) {
    var slides = this.state.slides.slice(0);
    newSlides.map(newSlide => {
      if (slides.length) {
        var pushSlide = true;
        for (var i = 0; i < slides.length; i++) {
          if (slides[i].id === newSlide.id) {
            pushSlide = false;
            break;
          }
        }
        if (pushSlide) {
          slides = [...slides, newSlide];
        }
      } else {
        slides = [newSlide];
      }
    });
    this.setState({
      slides: slides
    });
  }

  render() {
    const slides = this.state.slides;
    var second_button = "";
    if (slides.length) {
      second_button = <AddSlide addSlide={this.addSlide} />;
    }
    return (
      <div>
        <Slider slides={slides} />
        <AddSlide addSlide={this.addSlide} />
        <Slides
          slides={slides}
          deleteSlide={this.deleteSlide}
          moveSlide={this.moveSlide}
          updateSlideDetails={this.updateSlideDetails}
        />
        <input
          type="hidden"
          name="slider[slides]"
          value={JSON.stringify(slides)}
        />
        {second_button}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("slider"));

class SecondaryApp extends React.Component {
  constructor(props) {
    super(props);
    var properties = SLIDER ? SLIDER["properties"] : {};
    const defaults = { height: 600, width: 1200 };
    properties = Object.assign(defaults, properties);
    this.state = { properties: properties };

    this.updateSliderProperties = this.updateSliderProperties.bind(this);
  }

  updateSliderProperties(e) {
    e.preventDefault();
    const name = $(e.target).data("name");
    const value = $(e.target).val();

    const props = this.state.properties;
    this.setState({
      properties: Object.assign(props, { [name]: value })
    });
  }

  render() {
    let properties = this.state.properties;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>Width</td>
              <td>
                <input
                  type="number"
                  name="slider[properties][width]"
                  value={properties.width}
                  data-name="width"
                  onChange={this.updateSliderProperties}
                />
              </td>
            </tr>
            <tr>
              <td>Height</td>
              <td>
                <input
                  type="number"
                  name="slider[properties][height]"
                  value={properties.height}
                  data-name="height"
                  onChange={this.updateSliderProperties}
                />
              </td>
            </tr>
            <tr>
              <td>Slider type</td>
              <td>
                <select
                  name="slider[properties][slider_type]"
                  value={properties.slider_type}
                  data-name="slider_type"
                  onChange={this.updateSliderProperties}
                >
                  <option value="background">Image as background</option>
                  <option value="inline">Inline image</option>
                </select>
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <h3>Advanced Options</h3>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="checkbox"
                  className="alignright"
                  name="slider[properties][stretch]"
                  value="1"
                  data-name="stretch"
                  defaultChecked={properties.stretch}
                  id="stretch"
                />
              </td>
              <td>
                <label htmlFor="stretch">100% Wide</label>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="checkbox"
                  value="1"
                  className="alignright"
                  data-name="hide_on_mobile"
                  name="slider[properties][hide_on_mobile]"
                  id="hide_on_mobiles"
                />
              </td>
              <td>
                <label htmlFor="hide_on_mobiles">Hide on Mobiles</label>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="checkbox"
                  className="alignright"
                  name="slider[properties][hide_on_desktops_tablets]"
                  value="1"
                  data-name="hide_on_desktops_tablets"
                  id="hide_on_desktops_tablets"
                />
              </td>
              <td>
                <label htmlFor="hide_on_desktops_tablets">
                  Hide on Desktops & Tablets
                </label>
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <h3>Developer Options</h3>
              </td>
            </tr>
            <tr>
              <td>Wrapper class</td>
              <td>
                <input
                  type="text"
                  className="alignright"
                  name="slider[properties][wrapper_class]"
                  value={properties.wrapper_class}
                  data-name="wrapper_class"
                />
              </td>
            </tr>
            <tr>
              <td>Slider class</td>
              <td>
                <input
                  type="text"
                  className="alignright"
                  name="slider[properties][slider_class]"
                  value={properties.slider_class}
                  data-name="slider_class"
                />
              </td>
            </tr>
            <tr>
              <td>Slide class</td>
              <td>
                <input
                  type="text"
                  className="alignright"
                  name="slider[properties][slide_class]"
                  value={properties.slide_class}
                  data-name="slide_class"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/*<input type="submit" value="Save" className="button button-primary alignright"/>*/}
        <div className="clear" />
      </div>
    );
  }
}

ReactDOM.render(<SecondaryApp />, document.getElementById("slider-properties"));
