<?php
/**
 * Plugin Name: Simple Responsive Slider
 * Plugin URI: http://swiftthemes.com/simple-slider/
 * Description: A very lightweight slider for WordPress built using [Unslider](https://idiot.github.io/unslider/). Around 10KB footprint, less than 5KB when gzipped.
 * Version: 2.2.7
 * Author: Satish Gandham
 * Author URI: http://SatishGandham.Com
 *
 * @author Satish Gandham <hello@satishgandham.com>
 * License: GPLv2 or later
 *
 */

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/


define( 'SRS_URI', plugin_dir_url( __FILE__ ) );
define( 'SRS_DIR', __FILE__ );

if ( is_admin() ) {
	include_once 'admin/meta-boxes.php';
}
include_once 'admin/register-cpt.php';
include_once 'inc/shortcodes.php';
if ( ! class_exists( 'Mobile_Detect' ) ) {
	require_once( 'inc/Mobile_Detect.php' );
}
add_action( 'wp_enqueue_scripts', 'srs_register_styles', 8 );
add_action( 'wp_enqueue_scripts', 'srs_enqueue_styles', 9 );

add_action( 'wp_enqueue_scripts', 'srs_register_scripts', 8 );
add_action( 'wp_enqueue_scripts', 'srs_enqueue_scripts', 9 );

add_action( 'admin_enqueue_scripts', 'srs_enqueue_admin_scripts', 9 );


function srs_register_styles() {
	wp_register_style( 'srs-slider-styles', SRS_URI . 'assets/css/unslider.css' );
}

function srs_enqueue_styles() {
	wp_enqueue_style( 'srs-slider-styles' );
}

function srs_register_scripts() {
	wp_register_script( 'srs-unslider', SRS_URI . 'assets/js/srs-slider.min.js', array( 'jquery' ) );
}

function srs_enqueue_scripts() {
	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'srs-unslider' );
}

function srs_enqueue_admin_scripts() {
	wp_enqueue_script( 'jquery' );
	wp_enqueue_media();
	wp_enqueue_script( 'srs-react', SRS_URI . 'assets/js/admin/react.min.js', array() );
	wp_enqueue_script( 'srs-react-dom', SRS_URI . 'assets/js/admin/react-dom.min.js', array() );
	wp_enqueue_script( 'srs-admin-react', SRS_URI . 'assets/js/admin/srs-admin-scripts.min.js', array(
		'srs-react',
		'srs-react-dom'
	), '', true );

	wp_register_style( 'srs-admin-styles', SRS_URI . 'assets/css/admin.css' );
	wp_enqueue_style( 'srs-admin-styles' );

	wp_enqueue_style( 'srs-slider-styles', SRS_URI . 'assets/css/unslider.css' );
	wp_enqueue_script( 'srs-unslider', SRS_URI . 'assets/js/srs-slider.min.js', array( 'jquery' ) );

}


/**
 * @param $query_args arguments for wp_query
 * @param string $template Which style to use for slides
 * @param array $img_size image sizes
 * @param bool $show_excerpt show excerpts or not
 * @param string $classes CSS classes for the slider.
 */
function srs_query_slider(
	$query_args, $template = '', $img_size = array(
	1200,
	600
), $show_excerpt = false, $classes = '',$speed=6000
) {


	$defaults    = array(
		'ignore_sticky_posts' => 1,
		'posts_per_page'      => 4,
	);
	$query_args  = wp_parse_args( $query_args, $defaults );
	$recentPosts = new WP_Query( $query_args );
	$height      = $img_size[1] . 'px';


	if ( have_posts() ) :
		$i=0;
		?>
        <div class="srs-slider" data-speed="<?php echo $speed?>" style="height: <?php echo $height; ?>">
            <ul class="cf slides">
				<?php
				while ( $recentPosts->have_posts() ) : $recentPosts->the_post();
					if ( 'background_image' === $template ) {
						srs_slide_background_image( $img_size, $show_excerpt );
					} else {
						srs_slide_inline_image( $img_size, $show_excerpt, $i++ );
					}
				endwhile;
				?>
            </ul>
        </div>
		<?php
	endif;
}


function srs_slide_background_image( $size, $excerpt = false ) {
	?>
    <li>
        <div class="image-bg" onclick="window.open('<?php the_permalink(); ?>','_self');return false;"
             style="background-image:url('<?php echo esc_url( get_the_post_thumbnail_url( null, $size ) ) ?>'); "
        >
            <div class="caption">
                <h2 class="post-title">
					<?php the_title(); ?>
                </h2>
				<?php if ( $excerpt ) {
					the_excerpt();
				} ?>
            </div>
        </div>
    </li>
	<?php
}

function srs_slide_inline_image( $size, $excerpt = false, $index ) {
	$lazy_load='';
	if($index === 0){
		$lazy_load = 'no-lazy-load';
	}
	?>
    <li>
        <a href="<?php the_permalink(); ?>">
			<?php the_post_thumbnail( $size, array( 'class' => 'alignleft '.$lazy_load ) ); ?></a>
        <div class="caption">
            <h2 class="post-title">
                <a href="<?php the_permalink(); ?>"
                   title="<?php printf( esc_attr__( 'Permalink to %s', 'swift' ), the_title_attribute( 'echo=0' ) ); ?>"
                   rel="bookmark"><?php the_title(); ?> </a>
            </h2>
			<?php if ( $excerpt ) {
				the_excerpt();
			} ?>
        </div>
    </li>
	<?php
}

if ( is_admin() ) {
	require 'admin/plugin-update-checker/plugin-update-checker.php';
	$MyUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
		'https://updates.swiftthemes.com?action=get_metadata&slug=simple-responsive-slider', //Metadata URL.
		__FILE__, //Full path to the main plugin file.
		'simple-responsive-slider' //Plugin slug. Usually it's the same as the name of the directory.
	);
}