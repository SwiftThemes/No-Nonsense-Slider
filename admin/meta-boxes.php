<?php

add_action( 'edit_form_after_title', 'srs_add_slides_button' );

function srs_add_slides_button() {
	$scr = get_current_screen();

	if ( 'slider' !== $scr->post_type ) {
		return;
	}
	global $post;
	$id = $post->ID;
	wp_nonce_field( basename( __FILE__ ), "nns-slider-nonce" );

	echo '<div id="slider"></div>';
	echo '<script type="application/javascript">SLIDER = ' . json_encode( get_post_meta( $id, '_slider', true ) ) . '</script>';
}


function srs_slider_properties() {
	echo '<div id="slider-properties"></div>';
}

add_action( 'add_meta_boxes', 'srs_meta_box_add', 200 );
function srs_meta_box_add() {
	add_meta_box( 'srs_slider_props', __( 'Slider Properties', 'nns' ), 'srs_slider_properties', 'slider', 'side', 'core' );
	add_meta_box( 'srs_slider_help', __( 'How to use', 'nns' ), 'srs_slider_help', 'slider', 'side', 'core' );
}

function srs_save_slider( $post_id ) {


	if ( ! isset( $_POST["nns-slider-nonce"] ) || ! wp_verify_nonce( $_POST["nns-slider-nonce"], basename( __FILE__ ) ) ) {
		return $post_id;
	}

	if ( ! current_user_can( "edit_post", $post_id ) ) {
		return $post_id;
	}

	if ( defined( "DOING_AUTOSAVE" ) && DOING_AUTOSAVE ) {
		return $post_id;
	}

	$slider['slides'] = json_decode( stripslashes( $_POST['slider']['slides'] ), true );
	$slider['properties'] = $_POST['slider']['properties'];
	update_post_meta( $post_id, '_slider', $slider );

}

add_action( "save_post", "srs_save_slider", 10, 3 );


function srs_remove_publish_box() {
	remove_meta_box( 'submitdiv', 'slider', 'side' );
}

//add_action( 'admin_menu', 'srs_remove_publish_box' );


function srs_slider_help() {
	global $post;
	?>
    <div style="font-size: 14px;line-height: 1.5em">
        To display your slideshow, add the following shortcode (in orange) to your page.
        If adding the slideshow to your theme files, additionally include the surrounding PHP function (in green).

        <pre style="color: green;background: #fff">
&lt;?php echo do_shortcode('
  <span style="color:orange">[simple_slider id="<?php echo $_GET['post']?>"]</span>
'); ?&gt;
    </pre>
        <p>
            If you are using our PageSpeed WordPress theme, you can include the slider on home page from the customizer.
        </p>
    </div>
	<?php
}