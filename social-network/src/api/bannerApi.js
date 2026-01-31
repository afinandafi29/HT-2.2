import { supabase } from '../supabase/config';

// Helper to get local banners
const getLocalBanners = () => JSON.parse(localStorage.getItem('homeBanners') || '[]');
const setLocalBanners = (banners) => localStorage.setItem('homeBanners', JSON.stringify(banners));

export const getBannersApi = async () => {
    try {
        const { data, error } = await supabase
            .from('banners')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching banners (using fallback):', error);
        return getLocalBanners();
    }
};

export const uploadBannerApi = async (fileOrData) => {
    try {
        let bannerData;

        if (fileOrData instanceof File) {
            const file = fileOrData;
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `banners/${fileName}`;

            // 1. Try Upload to Supabase Storage
            let publicUrl = URL.createObjectURL(file); // Default to local blob if storage fails
            try {
                const { error: uploadError } = await supabase.storage
                    .from('banners')
                    .upload(filePath, file);

                if (!uploadError) {
                    const { data } = supabase.storage.from('banners').getPublicUrl(filePath);
                    if (data) publicUrl = data.publicUrl;
                }
            } catch (e) {
                console.warn('Storage upload failed, using local blob:', e);
            }

            bannerData = {
                id: Date.now(),
                name: file.name,
                url: publicUrl,
                type: file.type.startsWith('video') ? 'video' : 'image',
                visible: true,
                text: '',
                link: '',
                created_at: new Date().toISOString()
            };
        } else {
            // Text-only banner
            bannerData = {
                id: Date.now(),
                name: 'Text Banner',
                url: '',
                type: 'text',
                visible: true,
                text: fileOrData.text || '',
                link: fileOrData.link || '',
                background: fileOrData.background || 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                created_at: new Date().toISOString()
            };
        }

        // 3. Try Save to Database
        try {
            const { data, error: dbError } = await supabase
                .from('banners')
                .insert([{ ...bannerData, id: undefined }]) // Let DB generate ID if possible
                .select();

            if (!dbError && data) {
                return data[0];
            }
        } catch (e) {
            console.warn('DB insert failed, using local storage:', e);
        }

        // Fallback: Save to LocalStorage
        const current = getLocalBanners();
        const newBanners = [...current, bannerData];
        setLocalBanners(newBanners);
        return bannerData;

    } catch (error) {
        console.error('Error uploading banner:', error);
        throw error;
    }
};

export const updateBannerApi = async (banner) => {
    // 1. Try Update Database
    try {
        const { error } = await supabase
            .from('banners')
            .update({
                visible: banner.visible,
                text: banner.text,
                link: banner.link
            })
            .eq('id', banner.id);

        if (error) throw error;
    } catch (e) {
        console.warn('DB update failed, updating local storage:', e);
        // Fallback
        const current = getLocalBanners();
        const updated = current.map(b => b.id === banner.id ? banner : b);
        setLocalBanners(updated);
    }
    return banner;
};

export const deleteBannerApi = async (banner) => {
    try {
        // 1. Try Delete from Storage & DB
        try {
            if (banner.url.includes('supabase')) {
                const urlSegments = banner.url.split('/');
                const fileName = urlSegments[urlSegments.length - 1];
                const filePath = `banners/${fileName}`;
                await supabase.storage.from('banners').remove([filePath]);
            }

            await supabase.from('banners').delete().eq('id', banner.id);
        } catch (e) {
            console.warn('DB delete failed:', e);
        }

        // 2. Update LocalStorage always to be safe
        const current = getLocalBanners();
        const filtered = current.filter(b => b.id !== banner.id);
        setLocalBanners(filtered);

        return true;
    } catch (error) {
        console.error('Error deleting banner:', error);
        throw error;
    }
};
