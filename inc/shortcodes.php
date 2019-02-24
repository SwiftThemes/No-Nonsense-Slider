<?php
/**
 * Created by PhpStorm.
 * User: satish
 * Date: 25/06/18
 * Time: 4:48 PM
 */

if ( ! function_exists( 'srs_slider' ) ) {

	function srs_slider( $attr, $content ) {
		
		$id = absint( $attr['id'] );
		if ( ! $id ) {
			//@todo Show an error message if admin
			return;
		}

		$mobile_detect = new Mobile_Detect();

		$slider = get_post_meta( $id, '_slider', true );

		$props = $slider['properties'];

		if ( isset( $props['hide_on_mobile'] ) && $props['hide_on_mobile'] && ( $mobile_detect->isMobile() && ! $mobile_detect->isTablet() ) ) {
			return;
		}
		if ( isset( $props['hide_on_desktops_tablets'] ) && $props['hide_on_desktops_tablets'] && ! ( $mobile_detect->isMobile() && ! $mobile_detect->isTablet() ) ) {
			return;
		}

		$size = array( $props['width'], $props['height'] );

		if ( $mobile_detect->isMobile() && ! $mobile_detect->isTablet() ) {
			$size = array(
				600,
				(int) ( 600 / $props['width'] * $props['height'] )
			);
		}


		if ( 'background' == $props['slider_type'] ) {
			if ( ( $mobile_detect->isMobile() ) ) {
				$height = ( string )( $props['height'] / $props['width'] * 100 ) . 'vw';
			} else {
				$height = $props['height'] . 'px';
			}
		} else {
			$height = 'auto';
		}


		$slider_width = isset($props['stretch']) ? '100%' : $props['width'] . 'px';


		$out = "<div class='simple-slider-wrap' style='width:{$slider_width}'><div class='srs-slider' data-delay='1000' style='height:{$height};'><ul>";
		foreach ( $slider['slides'] as $slide ) {
			$out .= srs_get_slide( $slide, $size, $props['slider_type'] );
		}
		$out .= '</ul></div></div> ';


		return $out;
	}

}
add_shortcode( 'simple_slider', 'srs_slider' );


function srs_get_slide( $slide, $size, $type = 'inline' ) {

	$defaults = array(
		'anchor'           => '#',
		'caption_position' => 'bottom-center',
		'target'           => '',
		'rel'              => '',
	);
	$slide = wp_parse_args( $slide, $defaults );
	$anchor           = isset( $slide['anchor'] ) ? $slide['anchor'] : '#';
	$caption_position = isset( $slide['caption_position'] ) ? $slide['caption_position'] : 'bottom-center';

	if ( 'inline' == $type ) {
		return "<li><a href='{$anchor}' rel='{$slide['rel']}' target='{$slide['target']}'>" . wp_get_attachment_image( $slide['id'], $size ,array( 'class' => 'alignleft no-lazy-load' )) . "</a>
						<div class='caption {$caption_position}'><h2>{$slide['title']}</h2><p>{$slide['caption']}</p></div> </li>";
	} else {

		$image = wp_get_attachment_image_src( $slide['id'], $size );

		return "<li><div class='image-bg' onclick=\"window.open('{$slide['anchor']}','_self');return false\"
					style=\"background-image: url('" . $image[0] . "')\">
						<div class='caption {$caption_position}'><h2>{$slide['title']}</h2><p>{$slide['caption']}</p></div></div></li>";
	}

}

?>